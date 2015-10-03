import lda
import cPickle as pickle
import numpy as np
from argparse import ArgumentParser
from path import Path
from tqdm import tqdm
from nltk.corpus import stopwords

stop_words = set(stopwords.words('english'))
ignore_songs = set([
    'TRMLOGP128F930BE4A',
    'TRWOXFD128F425BE16',
    'TRPMADH128F93406B7',
    'TRTFEWC12903D0CDEA',
    'TRQKYBY128F4256880',
    'TRIEBZY128F934B06A',
    'TRQXQLN128F42A24EF',
    'TRYBCAM128F148F761',
    'TRGBIRH128F4245FBF',
    'TRMSHPF128E07889CE',
    'TROHRQN128F42BC6F3',
    'TRPWZOK128F426BCA9',
    'TRGHVKP12903CB0EEC',
    'TRPLJPL128F423B6DB',
    'TRWGYCY12903CE73CD',
    'TRGLKKV128F427FFA3',
    'TRRAWLU12903CB3E16',
    'TRTTGIP128F147E91F',
    'TRNYJMM128F427C719',
])
# stop_words = set(['you', 'i', 'and', 'the'])

def parse_args():
    argparser = ArgumentParser()

    argparser.add_argument('data_dir', default='data/')

    return argparser.parse_args()

def parse_file(fp):

    lyrics = {}
    mm_map = {}
    word_map = {}
    for line in fp:
        if not line:
            continue
        elif line[0] == "#":
            continue
        elif line[0] == "%":
            words = line[1:].strip().split(',')
            new_words = []
            i = 0
            for j, word in enumerate(words):
                if word not in stop_words:
                    word_map[j] = i
                    i += 1
                    new_words.append(word)
        else:
            lyric = line.strip().split(',')
            (id, mm_id), rest = tuple(lyric[0:2]), lyric[2:]
            if id in ignore_songs:
                continue
            mm_map[id] = mm_id
            lyrics[id] = {}
            for word in rest:
                word_id, count = word.split(":")
                word_id = int(word_id)
                if word_id in word_map:
                    word_id = word_map[int(word_id)]
                    count = int(count)
                    lyrics[id][word_id] = count
    return new_words, lyrics

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
    with open(data_dir / 'lyrics.vocab', 'w') as fp:
        for word in words:
            print >>fp, word
    with open(data_dir / 'ids.pkl', 'wb') as fp:
        pickle.dump(ids, fp)
