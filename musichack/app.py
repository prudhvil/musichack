import logging
logging.basicConfig(level=logging.INFO)
from path import Path
from data import load_data
from argparse import ArgumentParser

from server import SongServer

def parse_args():
    argparser = ArgumentParser()
    argparser.add_argument('data_dir', default='data/')
    argparser.add_argument('--port', default=8080)

    return argparser.parse_args()

if __name__ == "__main__":

    args = parse_args()

    data_dir = Path(args.data_dir)
    nbrs, topic_mat, ids, song_mapping = load_data(data_dir)

    server = SongServer(nbrs, topic_mat, ids, song_mapping)
    server.start(args.port)
