from gensim import corpora, models
import os

TEMP_FOLDER = os.path.join(os.path.sep, os.getcwd(), 'temp/')

# docid_list_String = key: docID, value: list(NOT set) of all words appearing in the doc in the order
#  of appearance
def save_gensim_dict(docID_list_strings):
    if not os.path.exists(TEMP_FOLDER):
        os.makedirs(TEMP_FOLDER)
    words_per_docs = [coll_words for docId, coll_words in docID_list_strings.items()]

    dictionary = corpora.Dictionary(words_per_docs)
    # TODO further research into this/similar functionalities
    dictionary.filter_extremes(no_below=2, no_above=0.8)
    # store the dictionary, for future reference
    dictionary.save(os.path.join(TEMP_FOLDER, 'data_gensim.dict'))
    words_list = list()
    for words_in_doc in words_per_docs:
        words_list.append(words_in_doc)
    corpus = [dictionary.doc2bow(words) for words in words_list]

    # store to disk, for later use
    try:
        corpora.MmCorpus.serialize(os.path.join(TEMP_FOLDER, 'corpus.mm'), corpus)
        print("Gensim preparation of docs is successful: check temp folder")

    except Exception as ex:
        template = "An exception of type {0} occurred. Arguments:\n{1!r}"
        message = template.format(type(ex).__name__, ex.args)
        print(message)


def get_gensim_dict():
    if os.path.exists(os.path.join(TEMP_FOLDER, 'data_gensim.dict')):
        try:
            dictionary = corpora.Dictionary.load(os.path.join(TEMP_FOLDER, 'data_gensim.dict'))
            print("Used files generated from the last indexing")
            return dictionary

        except Exception as ex:
            template = "An exception of type {0} occurred. Arguments:\n{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            print(message)


def get_corpus():
    if os.path.exists(os.path.join(TEMP_FOLDER, 'corpus.mm')):
        try:
            corpus = corpora.MmCorpus(os.path.join(TEMP_FOLDER, 'corpus.mm'))
            print("Loading corpus.. ")
            return corpus
        except Exception as ex:
            template = "An exception of type {0} occurred. Arguments:\n{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            print(message)


def do_lda_modelling(corpus, dictionary, topcnr= 50):
    lda = models.ldamodel.LdaModel(corpus=corpus, id2word=dictionary, num_topics=topcnr, update_every=0, chunksize=3500, passes=5)
    save_lda_model(lda)
    return lda




# filtering all the tokens, with 1 character/turns out there are many of them
# does not allow good topic modeling
def filter_tokens(docs_tokens):
    filtr_docs_tokens = dict()
    for docId, tokens in docs_tokens.items():
        filtr_docs_tokens[docId] = [token for token in tokens if len(token) > 1]
    return filtr_docs_tokens


def save_lda_model(lda_model):
    if os.path.exists(os.path.join(TEMP_FOLDER)):
        try:
            lda_model = lda_model.save(os.path.join(TEMP_FOLDER, 'lda_model.lda'))
            print("Saving lda model.. ")
            return lda_model
        except Exception as ex:
            template = "An exception of type {0} occurred. Arguments:\n{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            print(message)


def load_ldamodel():
    if os.path.exists(os.path.join(TEMP_FOLDER, 'lda_model.lda')):
        try:
            lda_model = models.LdaModel.load(os.path.join(TEMP_FOLDER, 'lda_model.lda'))
            print("Loading lda model.. ")
            return lda_model
        except Exception as ex:
            template = "An exception of type {0} occurred. Arguments:\n{1!r}"
            message = template.format(type(ex).__name__, ex.args)
            print(message)