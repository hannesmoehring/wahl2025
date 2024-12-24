from collections import Counter
import re
from typing import List, Dict, Tuple

class PartyObject:
    def __init__(self, name  : str, text : str):
        self.name = name
        self.text = text
        self.length = len(text.split())
        self.mentioned_parties = {}
        self.text_metrics = {}
        self.sentiment_metrics = {}
        self.alias = []


class SentimentAnalyzer:
    def __init__(self):
        self.sentiment_dict = {}
        self._load_sentiws('SentiWS_v2.0/SentiWS_v2.0_Positive.txt')
        self._load_sentiws('SentiWS_v2.0/SentiWS_v2.0_Negative.txt')
    

    def _load_sentiws(self, file_path: str):
        with open(file_path, 'r', encoding='utf-8') as file:
            for line in file:
                if line.strip() and not line.startswith('#'):
                    parts = line.strip().split('\t')
                    if len(parts) >= 2:
                        word_pos = parts[0].split('|')[0].lower()
                        weight = float(parts[1])
                        self.sentiment_dict[word_pos] = weight
                        
                        if len(parts) > 2:
                            inflections = parts[2].split(',')
                            for inflection in inflections:
                                self.sentiment_dict[inflection.lower()] = weight


    def analyze_text(self, text: str) -> dict:
        words = text.lower().split()
        sentiment_scores = []
        found_sentiment_words = []
        
        for word in words:
            if word in self.sentiment_dict:
                score = self.sentiment_dict[word]
                sentiment_scores.append(score)
                found_sentiment_words.append((word, score))
        
    
        total_words = len(words)
        sentiment_words = len(sentiment_scores)
        
        if sentiment_scores:
            average_sentiment = sum(sentiment_scores) / len(sentiment_scores)
            max_positive = max(sentiment_scores) if any(s > 0 for s in sentiment_scores) else 0
            max_negative = min(sentiment_scores) if any(s < 0 for s in sentiment_scores) else 0
        else:
            average_sentiment = 0
            max_positive = 0
            max_negative = 0
        
        return {
            'average_sentiment': average_sentiment,
            'sentiment_words_count': sentiment_words,
            'total_words': total_words,
            'sentiment_coverage': sentiment_words / total_words if total_words > 0 else 0,
            'max_positive_sentiment': max_positive,
            'max_negative_sentiment': max_negative,
            #'found_sentiment_words': found_sentiment_words
        }


class TextAnalyzer:
    def __init__(self):
        self.stop_words = set(['der', 'die', 'das', 'den', 'dem', 'und', 'in', 'von', 'mit', 'zu', 'für', 
                             'auf', 'ist', 'sind', 'werden', 'wurde', 'bei', 'seit', 'hat', 'haben'])
        
        self.policy_areas = {
            'wirtschaft': ['wirtschaft', 'unternehmen', 'arbeitsplätze', 'industrie', 'handel', 'firmen'],
            'umwelt': ['klima', 'umwelt', 'nachhaltigkeit', 'erneuerbare', 'energiewende', 'klimawandel', 'naturschutz', 'umweltschutz', 'co2'],
            'soziales': ['sozial', 'rente', 'pflege', 'gesundheit', 'familie', 'armut', 'integration','kinder'],
            'bildung': ['bildung', 'schule', 'universität', 'ausbildung', 'forschung', 'wissenschaft', 'studenten'],
            'sicherheit': ['sicherheit', 'polizei', 'verteidigung', 'kriminalität', 'bundeswehr', 'armee', 'terrorismus', 'gewalt']
        }

    def analyze_text(self, text: str) -> dict:
        words = self._preprocess_text(text)
        
        return {
            'readability_metrics': self._calculate_readability(text),
            'vocabulary_richness': self._calculate_vocabulary_richness(words),
            'top_keywords': self._extract_keywords(words, n=20),
            'policy_focus': self._analyze_policy_areas(text),
            'sentence_stats': self._analyze_sentences(text),
            'comparative_metrics': self._calculate_comparative_metrics(text)
        }

    def _preprocess_text(self, text: str) -> List[str]:
        words = text.lower().split()
        words = [word for word in words if word not in self.stop_words and word.isalpha()]
        return words

    def _calculate_readability(self, text: str) -> dict:
        sentences = re.split('[.!?]+', text)
        words = text.split()
        syllables = sum(self._count_syllables(word) for word in words)
        
        avg_sentence_length = len(words) / len(sentences) if sentences else 0
        
        avg_word_length = sum(len(word) for word in words) / len(words) if words else 0
        
        return {
            'avg_sentence_length': round(avg_sentence_length, 2),
            'avg_word_length': round(avg_word_length, 2),
            'syllables_per_word': round(syllables / len(words), 2) if words else 0
        }


    def _calculate_vocabulary_richness(self, words: List[str]) -> dict:
        total_words = len(words)
        unique_words = len(set(words))
        
        return {
            'unique_words': unique_words,
            'type_token_ratio': round(unique_words / total_words, 4) if total_words > 0 else 0,
            'hapaxlegomena': len([word for word, count in Counter(words).items() if count == 1])
        }

    def _extract_keywords(self, words: List[str], n: int) -> List[Tuple[str, int]]:
        return Counter(words).most_common(n)

    def _analyze_policy_areas(self, text: str) -> Dict[str, float]:
        text_lower = text.lower()
        results = {}
        sum_total = 0
        for area, keywords in self.policy_areas.items():
            count = sum(text_lower.count(keyword) for keyword in keywords)
            results[area] = round(count / len(text.split()) * 1000, 2)  # Occurrences per 1000 words
        
        for area, value in results.items():
            sum_total += value
        
        for area, value in results.items():
            results[area] = (int) ((value / sum_total) * 100)

        print(results)
        # normalize the results
        
        return results

    def _analyze_sentences(self, text: str) -> dict:
        sentences = re.split('[.!?]+', text)
        
        # Calculate sentence length distribution
        sentence_lengths = [len(s.split()) for s in sentences if s.strip()]
        
        return {
            'total_sentences': len(sentences),
            'max_sentence_length': max(sentence_lengths) if sentence_lengths else 0,
            'min_sentence_length': min(sentence_lengths) if sentence_lengths else 0,
            'complex_sentences': sum(1 for length in sentence_lengths if length > 20)  # Sentences with >20 words
        }

    def _calculate_comparative_metrics(self, text: str) -> dict:
        words = text.lower().split()
        
        return {
            'future_orientation': sum(1 for word in words if word in ['werden', 'zukunft', 'entwicklung', 'plan', 'vorhaben']),
            'concrete_measures': sum(1 for word in words if word in ['konkret', 'maßnahme', 'initiative', 'projekt', 'konkrete', 'genau', 'genaue', 'initiieren']),
            'intensity_markers': sum(1 for word in words if word in ['sehr', 'besonders', 'stark', 'deutlich', 'extrem', 'unfassbar']),
        }

    def _count_syllables(self, word: str) -> int:
        count = 0
        vowels = 'aeiouyäöü'
        word = word.lower()
        if word[0] in vowels:
            count += 1
        for i in range(1, len(word)):
            if word[i] in vowels and word[i-1] not in vowels:
                count += 1
        if count == 0:
            count += 1
        return count