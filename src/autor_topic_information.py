from models.Data import Data

def determine_topics():
    for i, author in Data.authors.items():
        papers_written = author.papers

        for paper in papers_written:
            # add topic of paper to the topics of the author if not already present
            if paper.topic not in author.topics:
                author.topics.add(paper.topic)


