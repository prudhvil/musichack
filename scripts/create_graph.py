from sklearn.neighbors import NearestNeighbors, LSHForest
import cPickle as pickle
from argparse import ArgumentParser
from path import Path

def parse_args():
    argparser = ArgumentParser()

    argparser.add_argument('data_dir', default='data/')
    argparser.add_argument('--k', type=int, default=4)

    return argparser.parse_args()


if __name__ == "__main__":

    args = parse_args()
    data_dir = Path(args.data_dir)
    with open(data_dir / 'lda.mat', 'rb') as fp:
        X = pickle.load(fp).todense()
    nbrs = LSHForest(n_neighbors=args.k + 1).fit(X)
    # distances, indices = nbrs.kneighbors(X)
