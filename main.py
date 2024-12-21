import PyPDF2 as pdf
from classes import PartyObject, SentimentAnalyzer, TextAnalyzer
import json

programme  = ["afd", "union", "spd", "gruene", "fdp"]
parties = {}
parties_sentiments = {}
sentiment_analyzer = SentimentAnalyzer()
text_analyzer = TextAnalyzer()


def init_parties():
    for party in programme:
        parties[party] = PartyObject(party, extract_cont(party))
        parties[party].mentioned_parties = count_mentioned_parties(party)


def init_sentiments():
    for party in programme:
        parties[party].sentiment_metrics = sentiment_analyzer.analyze_text(parties[party].text)


def init_text_analysis():
    for party in programme:
        parties[party].text_metrics = text_analyzer.analyze_text(parties[party].text)


def count_mentioned_parties(name : str):
    text = parties[name].text
    mentioned_parties = {}
    for party in programme:
        mentioned_parties[party] = text.count(party)
    return mentioned_parties



def extract_cont(name : str):
    with open('wahlprogramme25/' + name.lower() + ".pdf", "rb") as file:
        reader = pdf.PdfReader(file)
        text = ""
        for page in reader.pages:
            text += page.extract_text().lower()
        
        return text
    

def main():
    init_parties()
    init_sentiments()
    init_text_analysis()


    combined_data = {}

    for party in programme:
        party_data = {
            "text_length": parties[party].length,
            "sentiment_analysis": parties[party].sentiment_metrics,
            "text_analysis": parties[party].text_metrics,
            "mentioned_parties": parties[party].mentioned_parties,
        }

        combined_data[party] = party_data

        print(f"Party: {party}")
        print(f"Text length: {party_data['text_length']}")
        print(f"Sentiment analysis: {party_data['sentiment_analysis']}")
        print(f"Text analysis: {party_data['text_analysis']}")
        print(f"Mentioned parties: {party_data['mentioned_parties']}")
        print("")

    with open("wahl_dashboard/public/combined_data.json", "w") as json_file:
        json.dump(combined_data, json_file, indent=4)

main()