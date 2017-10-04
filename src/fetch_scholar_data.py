from libraries import scholar
from models.Data import Data
import time


text_file = open("scholar.txt", "w")

def fetch_citations():
    for key, paper in Data.papers.items():
        time.sleep(0.5)
        fetch_paper(paper)
    text_file.close()


def fetch_paper(paper):
    querier = scholar.ScholarQuerier()
    settings = scholar.ScholarSettings()
    querier.apply_settings(settings)

    query = scholar.SearchScholarQuery()
    query.set_phrase(paper.title)
    query.set_scope(True)
    query.set_num_page_results(1)

    querier.send_query(query)

    if len(querier.articles) > 0:
        num_citations = querier.articles[0]['num_citations']
        print(paper.id + "" + num_citations)
        text_file.write("%s %s" % (paper.id, num_citations))