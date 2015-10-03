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

    with open(data_dir / 'ids.pkl', 'rb') as fp:
        ids = pickle.load(fp)

    with open(data_dir / 'song_mapping.pkl', 'rb') as fp:
        sm = pickle.load(fp)

    with open(data_dir / 'artist_mapping.pkl', 'rb') as fp:
        am = pickle.load(fp)

    def get_song(id):
        return sm[ids[id]]
