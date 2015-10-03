import logging
logging.basicConfig(level=logging.INFO)
from argparse import ArgumentParser
from path import Path
from tqdm import tqdm
import cPickle as pickle


def parse_args():
    argparser = ArgumentParser()

    argparser.add_argument('data_dir', default='data/')

    return argparser.parse_args()

if __name__ == "__main__":
    args = parse_args()

    data_dir = Path(args.data_dir)

    song_mapping = {}
    artist_mapping = {}
    with open(data_dir / 'mxm_779k_matches.txt') as fp:
        for line in tqdm(fp):
            if not line:
                continue
            if line[0] == '#':
                continue
            id, artist_name, title, mm_id, _, _ = line.split('<SEP>')
            song_mapping[id] = (artist_name, title, mm_id)
            if artist_name not in artist_mapping:
                artist_mapping[artist_name] = set()
            artist_mapping[artist_name].add((id, title, mm_id))
    with open(data_dir / 'song_mapping.pkl', 'wb') as fp:
        pickle.dump(song_mapping, fp)
    with open(data_dir / 'artist_mapping.pkl', 'wb') as fp:
        pickle.dump(artist_mapping, fp)
