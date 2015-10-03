import lda
import cPickle as pickle
import numpy as np
from argparse import ArgumentParser
from path import Path
from tqdm import tqdm
from scipy import sparse


def parse_args():
    argparser = ArgumentParser()

    argparser.add_argument('data_dir', default='data/')

    return argparser.parse_args()

def parse_file(fp):

    lyrics = {}
    mm_map = {}
    for line in fp:
        if not line:
            continue
        elif line[0] == "#":
            continue
        elif line[0] == "%":
            words = line[1:].strip().split(',')
        else:
            lyric = line.strip().split(',')
            (id, mm_id), rest = tuple(lyric[0:2]), lyric[2:]
            mm_map[id] = mm_id
            lyrics[id] = {}
            for word in rest:
                word_id, count = word.split(":")
                word_id = int(word_id) - 1
                count = int(count)
                lyrics[id][word_id] = count
    return words, lyrics

def create_matrix(words, lyrics):
    N, D = len(lyrics), len(words)
    ids = []
    mat = np.zeros((N, D))
    for i, (id, lyric) in tqdm(enumerate(lyrics.iteritems())):
        ids.append(id)
        for word_id, count in lyric.iteritems():
            mat[i, word_id] = count
    return ids, mat


if __name__ == "__main__":

    args = parse_args()
    data_dir = Path(args.data_dir)

    with open(data_dir / 'mxm_dataset_train.txt') as fp:
        words, lyrics = parse_file(fp)
    ids, mat = create_matrix(words, lyrics)
    doclines = lda.utils.dtm2ldac(mat)
    with open(data_dir / 'lyrics.ldac', 'w') as fp:
        for line in doclines:
            print >>fp, line
    with open(data_dir / 'idwords.pkl', 'wb') as fp:
        pickle.dump((ids, words), fp)
