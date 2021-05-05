# Project of Data Visualization (COM-480)

| Student's name | SCIPER |
|----------------|--------|
| Polina Proskura | 328824 |
| Sophie du Couédic | 260007 |

[Milestone 1](#milestone-1) • [Milestone 2](#milestone-2) • [Milestone 3](#milestone-3)

## Milestone 1 (23rd April, 5pm)

**10% of the final grade**

### Main idea
Explore the words statistics in the news and tweets related to coronavirus. Find the topics, which affects people the most and how they are related to each other, display the lexical field used in the news compared to the lexical field used in the tweets.

*(max. 2000 characters per section)*

### Dataset
We choose to unite several datasets concerning coronavirus, first of them with the news and second of them with the tweets of concerned people.

*News datasets*
- [Covid fake news Dataset](https://data.mendeley.com/datasets/zwfdmp5syg/1), by Abhishek Koirala
- [Covid fake news Dataset](https://zenodo.org/record/4282522#.YH0t0YMzaxB), by Sumit Banik
*Tweets datasets*
- [Covid19 Tweets](https://www.kaggle.com/gpreda/covid19-tweets), by Gabriel Preda

Note : the news dataset concerning covid are all trying to label fake/true news. In fact, fake news are really a concern during those times, but it is not our purpose to try to classify the news, so we will simply ignore the fake/true label.

### Problematic

There are a lot of concerning and debating news and discussions about covid. Some of them are spreading fake information, some of them just sending panic messages. We want to explore the statistics of the texts and find the most redundants topics/words appearing in the texts, to get a grasp of the mindset of the people living this pandemic : their feelings, their concerns. The idea is also to see how the news content compares to the tweets content, to see if the news relates closely or not to what the population is really experiencing. Are the news using the same lexical field to talk about coronavirus? The second idea is to search the topics/words that relate closely to one another by afferring pairs of words that often appear in the same tweet/news (for example if “anxiety” appears often with the word “lockdown”) and make a graph of the topics related to each other.

The visualisation in that case have two main purposes:
- To show to concerned people different new topics related to coronavirus to explore.
- To get of grasp of the semantic representation of coronavirus, and how it impacted the meaning of certain words that were before so irrelevant (today the word lockdown hits totally differently).
- See how the news and journalistic publication relates  to (and maybe influence as well) people feelings and concerns during such an important event.

### Exploratory Data Analysis

The analysis is available in Exploratory_Data_Analysis.ipynb file.
The text was cleaned, normalized and lemmatized.
There are data on most frequent words in the text and also most frequent bigrams, since there are topics strongly connected to each other.

### Related work

Previous works with the data:
- The news datasets were used to train the classifier to detect the fake covid news and do not grow the panic in the world [link](https://arxiv.org/abs/2011.03327).
- The tweets dataset was used to do some exploratory analysis, including the dynamics of the tweets depending on time and geography ([here](https://www.kaggle.com/gpreda/covid19-tweets/tasks?taskId=1505) and [here](https://www.kaggle.com/gpreda/covid19-tweets/tasks?taskId=1694)). Also, there was a classification task to predict if the tweet was positive or negative [link](https://www.kaggle.com/gpreda/covid19-tweets/tasks?taskId=1506).

Our approach: Our main idea is to visualize the words and phrases distributions among the texts.
First of all, we will see the image representing the frequency of every included topic and its significance in the texts.
The second idea is using text vectorization techniques to find the topics which are really close to each other in terms of covid and visualize that closeness, so we can detect really different topics concerning the people.

### Display inspiration
We were inspired by the visual display of the meToo [work](http://metoomentum.com/assets/rooting.jpg) presented during the lecture, and will try to display in a similar architecture the different topics related to coronavirus.

### Previous Courses
Polina have worked with some tweets datas on the ADA and ML courses, but not with this current dataset, should I provide my work?

## Milestone 2 (7th May, 5pm)

**10% of the final grade**


## Milestone 3 (4th June, 5pm)

**80% of the final grade**


## Late policy

- < 24h: 80% of the grade for the milestone
- < 48h: 70% of the grade for the milestone
