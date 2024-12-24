// @ts-nocheck
"use client";


import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  ResponsiveContainer, LineChart, Line
} from 'recharts';

const PARTY_COLORS = {
  'afd': '#009EE0',
  'union': '#000000',
  'spd': '#E3000F',
  'gruene': '#46962b',
  'fdp': '#FFED00',
  _ : '#000000'
} as const;


interface SentimentAnalysis {
  average_sentiment: number;
  sentiment_words_count: number;
  total_words: number;
  sentiment_coverage: number;
  max_positive_sentiment: number;
  max_negative_sentiment: number;
}

interface TextAnalysis {
  readability_metrics: {
    avg_sentence_length: number;
    avg_word_length: number;
    syllables_per_word: number;
  };
  vocabulary_richness: {
    unique_words: number;
    type_token_ratio: number;
    hapaxlegomena: number;
  };
  top_keywords: [string, number][]; 
  policy_focus: {
    wirtschaft: number;
    umwelt: number;
    soziales: number;
    bildung: number;
    sicherheit: number;
  };
  comparative_metrics: {
    future_orientation: number;
    concrete_measures: number;
    intensity_markers: number;
  };
}

interface PartyData {
  text_length: number;
  sentiment_analysis: SentimentAnalysis;
  text_analysis: TextAnalysis;
  mentioned_parties: Record<string, number>;
  interesting_words_count: InterestingWordsCount;
}

interface CombinedData {
  [party: string]: PartyData;
}

interface InterestingWordsCount {
  [word: string]: number;
}

const PartyDashboard = () => {
  const [data, setData] = useState<CombinedData | null>(null);

  const [selectedCategory, setSelectedCategory] = useState<'negative_nomen' | 'negative_verben' | 'negative_adjektive' | 
    'positive_nomen' | 'positive_verben' | 'positive_adjektive' | 
    'sonstiges'>('positive_nomen');


    const wordCategories = {
      'negative_nomen': ["krieg", "sorge", "unsicherheit", "gefahr", "gefahren", "schuld", "schaden", "arbeitslosigkeit"],
      'negative_verben': ["verweigern", "ablehnen", "zerstören", "verlieren", "hassen", "betrügen", "scheitern", "verletzen", "vergessen", "verhindern", "verzögern"],
      'negative_adjektive': ["gemein", "egoistisch", "feindselig", "bösartig", "ungerecht", "unzuverlässig", "unehrlich", "grausam", "arrogant", "rücksichtslos"],
      'positive_nomen': ["liebe", "freundschaft", "hoffnung", "frieden", "glück", "erfolg", "ehrlichkeit", "vertrauen", "mut", "dankbarkeit"],
      'positive_verben': ["lieben", "helfen", "fördern", "ermutigen", "loben", "unterstützen", "schützen", "teilen", "verzeihen"],
      'positive_adjektive': ["freundlich", "hilfsbereit", "ehrlich", "zuverlässig", "mutig", "liebenswert", "loyal", "geduldig", "respektvoll", "dankbar"],
      'sonstiges': ["familie", "rente", "migration", "infrastruktur", "digitalisierung", "diversität", "kinder"]
    } as const;


  useEffect(() => {
    fetch('/combined_data.json')
      .then(response => response.json())
      .then((jsonData: CombinedData) => setData(jsonData))
      .catch(error => console.error('Error loading data:', error));
  }, []);

  if (!data) return <div>Loading...</div>;

  // Fixed topKeywordsData
  const topKeywordsData = Object.entries(data).map(([party, details]) => {
    const top5 = details.text_analysis.top_keywords
      .slice(0, 5)
      .reduce<Record<string, number>>((obj, [word, count]) => {
        obj[word] = count;
        return obj;
      }, {});
    return {
      name: party.toUpperCase(),
      ...top5
    };
  });

  // Fixed partyMentionsData
  const partyMentionsData = Object.entries(data).map(([party, details]) => ({
    name: party.toUpperCase(),
    ...details.mentioned_parties
  }));

  // Fixed parties mapping
  const parties = Object.entries(data).map(([party, details]) => ({
    name: party.toUpperCase(),
    ...details
  }));

  const sentimentData = parties.map(party => ({
    name: party.name,
    average: party.sentiment_analysis.average_sentiment,
    coverage: party.sentiment_analysis.sentiment_coverage
  }));

  const readabilityData = parties.map(party => ({
    name: party.name,
    ...party.text_analysis.readability_metrics
  }));

  const comparativeData = parties.map(party => ({
    name: party.name,
    ...party.text_analysis.comparative_metrics
  }));

  // Get list of parties for mentions chart
  const partyList = Object.keys(Object.values(data)[0].mentioned_parties);
  
    return (
        
      <div className="w-full max-w-6xl mx-auto p-4 space-y-8 text-black">
        <title>Partei Programm Analyse</title>
        <h1 className="text-3xl font-bold mb-6">Analyse der Parteiprogramme</h1>
        
        {/* Sentiment Analysis */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Sentiment Analysis</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sentimentData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="average" fill="#8884d8" name="Average Sentiment" />
                <Bar dataKey="coverage" fill="#82ca9d" name="Sentiment Coverage" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
  
        {/* Top Keywords */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Top 5 Keywords by Party</h2>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topKeywordsData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" />
                <YAxis dataKey="name" type="category" />
                <Tooltip />
                <Legend />
                {Object.keys(topKeywordsData[0]).filter(key => key !== 'name').map((word, index) => (
                  <Bar key={word} dataKey={word} fill={`hsl(${index * 60}, 70%, 60%)`} />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
  
        {/* Individual Policy Focus Charts */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {parties.map(party => (
            <div key={party.name} className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">{party.name} Policy Focus</h2>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={[party.text_analysis.policy_focus]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="wirtschaft" fill="#8884d8" name="Economy" />
                    <Bar dataKey="umwelt" fill="#82ca9d" name="Environment" />
                    <Bar dataKey="soziales" fill="#ffc658" name="Social" />
                    <Bar dataKey="bildung" fill="#ff7300" name="Education" />
                    <Bar dataKey="sicherheit" fill="#0088fe" name="Security" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          ))}
        </div>
  
        {/* Party Mentions section */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
            <h2 className="text-xl font-semibold mb-4">Party Mentions</h2>
            <div className="h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={partyMentionsData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        {partyList.map((party: string) => (
                          <Bar 
                              key={party} 
                              dataKey={party} 
                              fill={PARTY_COLORS[party]} // eslint-disable-line 
                              name={party.toUpperCase()}
                          />
                      ))}
    
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </div>
  
        {/* Readability Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Readability Metrics</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={readabilityData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="avg_sentence_length" 
                  stroke="#8884d8" 
                  name="Avg Sentence Length" 
                />
                <Line 
                  type="monotone" 
                  dataKey="avg_word_length" 
                  stroke="#82ca9d" 
                  name="Avg Word Length" 
                />
                <Line 
                  type="monotone" 
                  dataKey="syllables_per_word" 
                  stroke="#ffc658" 
                  name="Syllables per Word" 
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
  
        {/* Comparative Metrics */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold mb-4">Comparative Metrics</h2>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={comparativeData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar 
                  dataKey="future_orientation" 
                  fill="#8884d8" 
                  name="Future Orientation" 
                />
                <Bar 
                  dataKey="concrete_measures" 
                  fill="#82ca9d" 
                  name="Concrete Measures" 
                />
                <Bar 
                  dataKey="intensity_markers" 
                  fill="#ffc658" 
                  name="Intensity Markers" 
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-xl font-semibold mb-4">Word Usage Analysis</h2>
        <div className="mb-4">
          <select 
            className="p-2 border rounded"
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value as keyof typeof wordCategories)}
          >
            <option value="positive_nomen">Positive Nomen</option>
            <option value="positive_verben">Positive Verben</option>
            <option value="positive_adjektive">Positive Adjektive</option>
            <option value="negative_nomen">Negative Nomen</option>
            <option value="negative_verben">Negative Verben</option>
            <option value="negative_adjektive">Negative Adjektive</option>
            <option value="sonstiges">Sonstige Begriffe</option>
          </select>
        </div>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={Object.entries(data).map(([party, partyData]) => ({
              name: party.toUpperCase(),
              ...wordCategories[selectedCategory].reduce((acc, word) => ({
                ...acc,
                [word]: partyData.interesting_words_count[word] || 0
              }), {})
            }))}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              {wordCategories[selectedCategory].map((word) => (
                <Bar 
                  key={word} 
                  dataKey={word} 
                  fill={`hsl(${(wordCategories[selectedCategory].indexOf(word) * 360) / wordCategories[selectedCategory].length}, 70%, 60%)`} //eslint-disable-line
                  name={word}
                />
              ))}
            </BarChart>

          </ResponsiveContainer>
        </div>
      </div>
      </div>
    );
  };
  
  export default PartyDashboard;