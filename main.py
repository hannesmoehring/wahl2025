import PyPDF2 as pdf
from classes import PartyObject, SentimentAnalyzer, TextAnalyzer
import json

programme  = ["afd", "union", "spd", "gruene", "fdp"]
parties = {}
parties_sentiments = {}
sentiment_analyzer = SentimentAnalyzer()
text_analyzer = TextAnalyzer()

aliasess = {"afd": ["alternative für deutschland", "afd"],
            "union": ["cdu", "csu", "union", "unionparteien"],
            "spd": ["spd", "sozialdemokraten", "sozialdemokratische partei deutschlands"],
            "gruene": ["grüne", "grünen", "bündnis 90/die grünen", "gruene"],
            "fdp": ["fdp", "freie demokraten", "freie demokratische partei"]}
            
interesting_words = {"negative_nomen": ["krieg", "sorge", "unsicherheit", "gefahr", "gefahren", "schuld", "schaden", "arbeitslosigkeit"],
                     "negative_verben": ["verweigern", "ablehnen", "zerstören", "verlieren", "hassen", "betrügen", "scheitern", "verletzen", "vergessen", "stören" "schwächen", "zerstören", "verhindern", "verzögern"],
                     "negative_adjektive": ["gemein", "egoistisch", "feindselig", "bösartig", "ungerecht", "unzuverlässig", "unehrlich", "grausam", "arrogant", "rücksichtslos"],
                     
                     "positive_nomen": ["liebe", "freundschaft", "hoffnung", "frieden", "glück", "erfolg", "ehrlichkeit", "vertrauen", "mut", "dankbarkeit"],
                     "positive_verben": ["lieben", "helfen", "fördern", "vertrauen", "ermutigen", "loben", "unterstützen", "schützen", "teilen", "verzeihen"],
                     "positive_adjektive": ["freundlich", "hilfsbereit", "ehrlich", "zuverlässig", "mutig", "liebenswert", "loyal", "geduldig", "respektvoll", "dankbar"],
                     
                     "sonstiges": ["familie", "rente", "migration", "infrastruktur", "digitalisierung", "diversität", "kinder"]}




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
        mentioned_parties[party] = 0
        for alias in aliasess[party]:
            mentioned_parties[party] += text.count(alias)
    return mentioned_parties

def count_interesting_words(name : str):
    text = parties[name].text
    words = text.split()
    interesting_words_count = {}
    for key in interesting_words.keys():
        for word in interesting_words[key]:
            interesting_words_count[word] = words.count(word)

    return interesting_words_count

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
            "interesting_words_count": count_interesting_words(party)
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


for name in programme:
    print(name, count_interesting_words(name))