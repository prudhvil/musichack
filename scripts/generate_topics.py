import logging
logging.basicConfig(level=logging.INFO)
import numpy as np
from argparse import ArgumentParser
from path import Path
import gensim
from tqdm import tqdm
import cPickle as pickle
from scipy import sparse


def parse_args():
    argparser = ArgumentParser()

    argparser.add_argument('data_dir', default='data/')
    argparser.add_argument('--num_topics', type=int, default=50)
    argparser.add_argument('--num_iterations', type=int, default=1000)

    return argparser.parse_args()

if __name__ == "__main__":
    args = parse_args()

    data_dir = Path(args.data_dir)

    corpus = gensim.corpora.bleicorpus.BleiCorpus(data_dir / 'lyrics.ldac',
                                                  data_dir / 'lyrics.vocab')
    words = {}
    with open(data_dir / 'lyrics.vocab') as fp:
        for i, line in enumerate(fp):
            words[i] = line.strip()
    lda = gensim.models.ldamulticore.LdaMulticore(corpus, id2word=words,
                                                    num_topics=args.num_topics,
                                                  passes=5)
    transformed = lda[corpus]

    mat = np.zeros((len(corpus), args.num_topics))
    for i, doc in tqdm(enumerate(transformed)):
        for topic, prob in doc:
            mat[i][topic] = prob
    with open(data_dir / 'lda.mat', 'wb') as fp:
        pickle.dump(sparse.csr_matrix(mat), fp)
