import logging
import cPickle as pickle

def load_data(data_dir):
    logging.info("Loading data from %s" % data_dir)
    with open(data_dir / 'nbrs.pkl') as fp:
        nbrs = pickle.load(fp)
    with open(data_dir / 'lda.mat') as fp:
        topics = pickle.load(fp)
    with open(data_dir / 'ids.pkl') as fp:
        ids = pickle.load(fp)
    with open(data_dir / 'song_mapping.pkl') as fp:
        song_mapping = pickle.load(fp)
    return nbrs, topics, ids, song_mapping

