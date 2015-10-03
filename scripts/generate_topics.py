import logging
logging.basicConfig(level=logging.DEBUG)
import numpy as np
import cPickle as pickle
from argparse import ArgumentParser
from path import Path
from lda import LDA


def parse_args():
    argparser = ArgumentParser()

    argparser.add_argument('data_dir', default='data/')
    argparser.add_argument('--num_topics', type=int, default=50)
    argparser.add_argument('--num_iterations', type=int, default=1000)

    return argparser.parse_args()

if __name__ == "__main__":
    args = parse_args()

    data_dir = Path(args.data_dir)
    model = LDA(n_topics=args.num_topics,
                n_iter=args.num_iterations)

    with open(data_dir / 'lyrics.pkl', 'rb') as fp:
        ids, words, mat = pickle.load(fp)

    topic_mat = model.fit_transform(mat[:1000])

    topic_word = model.topic_word_
    for i, topic_dist in enumerate(topic_word):
        topic_words = np.array(words)[np.argsort(topic_dist)][:-8:-1]
        print('Topic {}: {}'.format(i, ' '.join(topic_words)))
