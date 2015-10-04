import random
import numpy as np
from flask import Flask, jsonify, request
from webargs import fields
from webargs.flaskparser import use_args
from trie import Trie
from functools import wraps
import artwork

class SongServer(object):

    def __init__(self, nbrs, topics, ids, song_mapping):
        self.song_cache = {}
        self.nbrs = nbrs
        self.topics = topics
        self.ids = ids
        self.song_mapping = song_mapping
        self.mid_to_id = {}
        for i, mid in enumerate(self.ids):
            self.mid_to_id[mid] = i

        self.autocomplete = Trie()
        self.name_map = {}
        for mid, song in song_mapping.iteritems():
            name = song[1]
            fixed_name = name.lower().decode('utf-8')
            if name.lower() not in self.name_map:
                self.name_map[fixed_name] = set()
            if mid in self.mid_to_id:
                self.name_map[fixed_name].add((self.mid_to_id[mid], name, song[0]))
                self.autocomplete.insert(fixed_name)

        app = self.app = Flask(__name__, static_url_path='', static_folder='static/')
        def jsonp(f):
            """Wraps JSONified output for JSONP"""
            @wraps(f)
            def decorated_function(*args, **kwargs):
                callback = request.args.get('callback', False)
                if callback:
                    content = str(callback) + '(' + str(f().data) + ')'
                    return app.response_class(content, mimetype='application/json')
                else:
                    return f(*args, **kwargs)
            return decorated_function

        @app.route('/')
        def index():
            return app.send_static_file('index.html')

        @app.route('/api/get_id')
        @jsonp
        @use_args({
            'id': fields.Int(required=True),
        })
        def get_id(args):
            if args['id'] in self.song_cache:
                return jsonify(**self.song_cache[args['id']])
            song = self.song_mapping[self.ids[args['id']]]
            aw = artwork.get_artwork(song)
            youtube_id = artwork.get_video(song)
            result = {
                'status': 1,
                'result': {
                    'id': args['id'],
                    'name': song[1],
                    'artist': song[0],
                    'artwork': aw,
                    'youtube': youtube_id,
                }
            }
            self.song_cache[args['id']] = result
            return jsonify(**result);

        @app.route('/api/get_neighbors')
        @jsonp
        @use_args({
            'id': fields.Int(required=True),
            'k': fields.Int(default=11)
        })
        def get_neighbors(args):
            _, neighbors = self.nbrs.kneighbors(self.topics[args['id']], n_neighbors=args['k'] + 1)
            neighbors = neighbors[0, 1:]
            return jsonify(**{
                'status': 1,
                'result': neighbors.tolist()
            })

        @app.route('/api/get_song')
        @jsonp
        @use_args({
            'name': fields.Str(required=True),
        })
        def get_song(args):
            if len(args['name']) < 3:
                return jsonify(**{
                    'status': 1,
                    'result': []
                })
            results = self.autocomplete.autocomplete(args['name'].lower())
            final_results = []
            for result in results:
                for final_result in list(self.name_map[result]):
                    final_results.append({
                        'id': final_result[0],
                        'name': final_result[1],
                        'artist': final_result[2]
                    })
            return jsonify(**{
                'status': 1,
                'result': final_results
            })


        @app.route('/api/get_next')
        @jsonp
        @use_args({
            'current_id': fields.Int(required=True),
            'end_id': fields.Int(required=True),
            'k': fields.Int(default=10, required=False),
        })
        def get_next(args):
            distances, neighbors = self.nbrs.kneighbors(self.topics[args['current_id']], n_neighbors=100)
            neighbors = neighbors[0, 1:]
            if args['end_id'] in neighbors:
                chosen = args['end_id']
                neighbors = neighbors.tolist()
                neighbors.remove(chosen)
                rest = neighbors
            else:
                vals = self.topics[neighbors]
                end = self.topics[args['end_id']]
                end_distances = np.sum((vals - end) ** 2, axis=1).argsort().tolist()
                to_pick = end_distances[0:3]
                chosen = random.choice(to_pick)
                end_distances.remove(chosen)
                chosen = neighbors[chosen]
                rest = []
                for d in end_distances:
                    rest.append(neighbors[d])
            return jsonify(**{
                'status': 1,
                'result': {
                    'next_id': chosen,
                    'neighbors': rest[:args['k']]
                }
            })

            pass

    def start(self, port, host='0.0.0.0', debug=True):
        self.app.run(port=port, host=host, debug=debug, use_reloader=False)
