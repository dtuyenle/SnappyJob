import nltk
from nltk.collocations import *


if __name__ == '__main__':

    tokens = []
    stopwords = nltk.corpus.stopwords.words('english')

    '''Load multiple documents and return it as a list. 
       Provide your implementation here'''
    data = []
    text_file = open("tags.txt", "r")
    lines = text_file.readlines()
    for line in lines:
    	data.append(line)

	print 'Total documents loaded: %d' % (len(data))

    ''' Apply stop words '''
    for d in data:
        data_tokens = nltk.wordpunct_tokenize(d)
        filtered_tokens = [w for w in data_tokens if w.lower() not in stopwords]
        tokens = tokens + filtered_tokens

    print 'Total tokens loaded: %d' % (len(tokens))
    print 'Calculating Collocations'

    ''' Extract only bigrams within a window of 5. 
        Implementation for trigram also available. NLTK
        has utility functions for frequency, ngram and word filter''' 
    bigram_measures = nltk.collocations.BigramAssocMeasures()
    finder = BigramCollocationFinder.from_words(tokens, 10)
    finder.apply_freq_filter(10)

    ''' Return the 1000 n-grams with the highest likelihood ratio.
        You can also use PMI or other methods and compare results '''
    print 'Printing Top 1000 Collocations'
    print finder.nbest(bigram_measures.likelihood_ratio, 1000)