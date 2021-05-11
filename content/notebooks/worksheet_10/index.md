---
title: "Worksheet 10 - Clustering"
description: ""
date: 2021-04-15T00:02:08-07:00
lastmod: 2021-04-15T00:02:08-07:00
draft: false
images: []
toc: true
menu:
  notebooks:
    parent: "notebooks"
---

### Lecture and Tutorial Learning Goals:

After completing this week's lecture and tutorial work, you will be able to:

- Describe a case where clustering would be an appropriate tool, and what insight it would bring from the data.
- Explain the k-means clustering algorithm.
- Interpret the output of a k-means cluster analysis.
- Perform k-means clustering in R using k-means
- Visualize the output of k-means clustering in R using a coloured scatter plot
- Identify when it is necessary to scale variables before clustering and do this using R
- Use the elbow method to choose the number of clusters for k-means
- Describe advantages, limitations and assumptions of the k-means clustering algorithm.

```R
### Run this cell before continuing.
library(tidyverse)
library(forcats)
library(repr)
library(broom)
options(repr.matrix.max.rows = 6)
source('tests_worksheet_10.R')
source("cleanup_worksheet_10.R")
```

**Question 0.0** Multiple Choice:
<br> {points: 1}

In which of the following scenarios would clustering methods likely be appropriate?

A. Identifying sub-groups of houses according to their house type, value, and geographical location

B. Predicting whether a given user will click on an ad on a website

C. Segmenting customers based on their preferences to target advertising

D. Both A. and B.

E. Both A. and C.

_Assign your answer to an object called `answer0.0`. Make sure your answer is an uppercase letter and is surrounded by quotation marks (e.g. `"F"`)._

```R
# your code
answer0.0 <- "E"
```

```R
test_0.0()
```

    [1] "Success!"

**Question 0.1** Multiple Choice:
<br> {points: 1}

Which step in the description of the k-means algorithm below is incorrect?

0. Choose the number of clusters

1. Randomly assign each of the points to one of the clusters

2. Calculate the position for the cluster centre (centroid) for each of the clusters (this is the middle of the points in the cluster, as measured by straight-line distance)

3. Re-assign each of the points to the cluster who's centroid is furthest from that point

4. Repeat steps 1 - 2 until the cluster centroids don't change very much between iterations

_Assign your answer to an object called `answer0.1`. Your answer should be a single numerical character surrounded by quotes._

```R
# your code here
answer0.1 <- "3"
```

```R
test_0.1()
```

    [1] "Success!"

## Hoppy Craft Beer

Craft beer is a strong market in Canada and the US, and is expanding to other countries as well. If you wanted to get into the craft beer brewing market, you might want to better understand the product landscape. One popular craft beer product is hopped craft beer. Breweries create/label many different kinds of hopped craft beer, but how many different kinds of hopped craft beer are there really when you look at the chemical properties instead of the human labels?

We will start to look at the question by looking at a [craft beer data set from Kaggle](https://www.kaggle.com/nickhould/craft-cans#beers.csv). In this data set, we will use the alcoholic content by volume (`abv` column) and the International bittering units (`ibu` column) as variables to try to cluster the beers. The `abv` variable has values 0 (indicating no alcohol) up to 1 (pure alcohol) and the `ibu` variable quantifies the bitterness of the beer (higher values indicate higher bitterness).

**Question 1.0**
<br> {points: 1}

Read in the `beers.csv` data using `read_csv()` and assign it to an object called `beer`. The data is located within the `worksheet_10/data/` folder.

_Assign your dataframe answer to an object called `beer`._

```R
# your code here
beer <- read_csv("data/beers.csv")
beer
```

    Warning message:
    “Missing column names filled in: 'X1' [1]”
    Parsed with column specification:
    cols(
      X1 = [32mcol_double()[39m,
      abv = [32mcol_double()[39m,
      ibu = [32mcol_double()[39m,
      id = [32mcol_double()[39m,
      name = [31mcol_character()[39m,
      style = [31mcol_character()[39m,
      brewery_id = [32mcol_double()[39m,
      ounces = [32mcol_double()[39m
    )

<table>
<caption>A spec_tbl_df: 2410 × 8</caption>
<thead>
	<tr><th scope=col>X1</th><th scope=col>abv</th><th scope=col>ibu</th><th scope=col>id</th><th scope=col>name</th><th scope=col>style</th><th scope=col>brewery_id</th><th scope=col>ounces</th></tr>
	<tr><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;chr&gt;</th><th scope=col>&lt;chr&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;dbl&gt;</th></tr>
</thead>
<tbody>
	<tr><td>0</td><td>0.050</td><td>NA</td><td>1436</td><td>Pub Beer           </td><td>American Pale Lager    </td><td>408</td><td>12</td></tr>
	<tr><td>1</td><td>0.066</td><td>NA</td><td>2265</td><td>Devil's Cup        </td><td>American Pale Ale (APA)</td><td>177</td><td>12</td></tr>
	<tr><td>2</td><td>0.071</td><td>NA</td><td>2264</td><td>Rise of the Phoenix</td><td>American IPA           </td><td>177</td><td>12</td></tr>
	<tr><td>⋮</td><td>⋮</td><td>⋮</td><td>⋮</td><td>⋮</td><td>⋮</td><td>⋮</td><td>⋮</td></tr>
	<tr><td>2407</td><td>0.055</td><td>NA</td><td>620</td><td>B3K Black Lager     </td><td>Schwarzbier             </td><td>424</td><td>12</td></tr>
	<tr><td>2408</td><td>0.055</td><td>40</td><td>145</td><td>Silverback Pale Ale </td><td>American Pale Ale (APA) </td><td>424</td><td>12</td></tr>
	<tr><td>2409</td><td>0.052</td><td>NA</td><td> 84</td><td>Rail Yard Ale (2009)</td><td>American Amber / Red Ale</td><td>424</td><td>12</td></tr>
</tbody>
</table>

```R
test_1.0()
```

    [1] "Success!"

**Question 1.1**
<br> {points: 1}

Let's start by visualizing the variables we are going to use in our cluster analysis as a scatter plot. Put `ibu` on the horizontal axis, and `abv` on the vertical axis. Name the plot object `beer_eda`.

_Remember to follow the best visualization practices, including adding human-readable labels to your plot._

```R
# your code here
beer_eda <- ggplot(beer, aes(x = ibu, y = abv)) + geom_point() + labs(x = "International Bittering Units", y = "Alcoholic Content by Volume")
beer_eda
```

    Warning message:
    “Removed 1005 rows containing missing values (geom_point).”

![png](output_13_1.png)

```R
test_1.1()
```

    [1] "Success!"

**Question 1.2**
<br> {points: 1}

We need to clean this data a bit. Specifically, we need to remove the rows where `ibu` is `NA`, and select only the columns we are interested in clustering, which are `ibu` and `abv`.

_Assign your answer to an object named `clean_beer`._

```R
# your code here
clean_beer <- beer %>% select(ibu, abv) %>% filter(!is.na(ibu))
clean_beer
```

<table>
<caption>A tibble: 1405 × 2</caption>
<thead>
	<tr><th scope=col>ibu</th><th scope=col>abv</th></tr>
	<tr><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;dbl&gt;</th></tr>
</thead>
<tbody>
	<tr><td>60</td><td>0.061</td></tr>
	<tr><td>92</td><td>0.099</td></tr>
	<tr><td>45</td><td>0.079</td></tr>
	<tr><td>⋮</td><td>⋮</td></tr>
	<tr><td>50</td><td>0.060</td></tr>
	<tr><td>45</td><td>0.067</td></tr>
	<tr><td>40</td><td>0.055</td></tr>
</tbody>
</table>

```R
test_1.2()
```

    [1] "Success!"

**Question 1.3.1** Multiple Choice:
<br>{points: 1}

Why do we need to scale the variables when using k-means clustering?

A. k-means uses the Euclidean distance to compute how similar data points are to each cluster center

B. k-means is an iterative algorithm

C. Some variables might be more important for prediction than others

D. To make sure their mean is 0

_Assign your answer to an object named `answer1.3.1`. Make sure your answer is an uppercase letter and is surrounded by quotation marks (e.g. `"F"`)._

```R
# your code here
answer1.3.1 <- "A"
```

```R
test_1.3.1()
```

    [1] "Success!"

**Question 1.3.2**
<br> {points: 1}

Let's do that scaling now. Recall that we used a `recipe` for scaling when doing classification and regression. This is because we needed to be able to split train and test data, compute a standardization on _just_ training data, and apply the standardization to _both_ train and test data.

But in clustering, there is no train/test split. So let's use the much simpler `scale` function in R. `scale` takes in a column of a dataframe and outputs the standardized version of it. We can therefore apply `scale` to all variables in the cleaned data frame using the `map_df` function.

_Note: you could still use a recipe to do this, using `prep`/`bake` appropriately. But `scale` is much simpler._

_Assign your answer to an object named `scaled_beer`. Use the scaffolding provided._

```R
# ... <- ... %>%
#    map_df(...)

# your code here
scaled_beer <- clean_beer %>%
   map_df(scale)
scaled_beer
```

<table>
<caption>A tibble: 1405 × 2</caption>
<thead>
	<tr><th scope=col>ibu</th><th scope=col>abv</th></tr>
	<tr><th scope=col>&lt;dbl[,1]&gt;</th><th scope=col>&lt;dbl[,1]&gt;</th></tr>
</thead>
<tbody>
	<tr><td>0.66605490</td><td>0.08000109</td></tr>
	<tr><td>1.89900237</td><td>2.87899086</td></tr>
	<tr><td>0.08811077</td><td>1.40583835</td></tr>
	<tr><td>⋮</td><td>⋮</td></tr>
	<tr><td> 0.28075881</td><td> 0.006343468</td></tr>
	<tr><td> 0.08811077</td><td> 0.521946846</td></tr>
	<tr><td>-0.10453727</td><td>-0.361944659</td></tr>
</tbody>
</table>

```R
test_1.3.2()
```

    [1] "Success!"

**Question 1.4**
<br> {points: 1}

From our exploratory data visualization, 2 seems like a reasonable number of clusters. Use the `kmeans` function with `centers = 2` to perform clustering with this choice of $k$.

_Assign your model to an object named `beer_cluster_k2`. Note that since k-means uses a random initialization, we need to set the seed again; don't change the value!_

```R

```

```R
# DON'T CHANGE THE SEED VALUE!
set.seed(1234)

# ... <- kmeans(..., centers = 2)
# your code here
beer_cluster_k2 <- kmeans(scaled_beer, centers = 2)
beer_cluster_k2
```

    K-means clustering with 2 clusters of sizes 917, 488

    Cluster means:
             ibu        abv
    1 -0.5830271 -0.5506271
    2  1.0955653  1.0346824

    Clustering vector:
       [1] 2 2 2 1 1 1 1 2 2 2 2 2 1 2 2 2 2 1 2 1 1 1 1 2 2 1 1 2 1 1 2 1 1 2 1 1 2
      [38] 1 2 2 2 1 1 1 1 1 2 1 2 1 1 1 1 1 1 2 1 1 1 1 1 2 1 1 1 1 1 1 1 2 1 1 1 2
      [75] 1 1 1 1 2 1 1 2 1 1 2 1 2 1 2 1 1 2 1 1 1 1 1 1 2 1 1 1 1 2 1 1 2 1 1 1 2
     [112] 2 1 1 2 2 1 2 2 1 1 1 2 1 1 2 1 1 2 2 1 1 2 1 1 1 2 1 2 1 1 1 1 1 2 2 2 2
     [149] 1 1 2 1 1 1 2 1 1 2 1 1 1 2 1 1 2 2 1 2 1 2 1 2 1 1 2 2 2 1 1 1 1 1 2 1 1
     [186] 1 1 2 2 1 1 2 1 1 1 1 1 1 1 2 1 1 1 2 1 1 2 1 1 1 1 1 1 1 1 1 1 1 2 1 1 2
     [223] 1 1 1 1 2 1 2 1 1 1 1 2 2 2 2 1 1 1 1 1 2 1 2 1 2 1 1 1 1 1 2 1 1 2 1 1 1
     [260] 2 2 1 1 1 1 1 1 2 2 2 1 1 1 1 1 2 1 1 1 1 2 1 2 1 2 1 1 1 2 2 1 1 1 1 1 1
     [297] 1 1 2 2 2 1 1 2 1 1 2 1 1 1 2 1 1 2 2 2 2 2 2 2 2 2 2 1 1 2 2 1 2 2 1 1 2
     [334] 1 2 1 1 2 1 1 2 2 1 1 1 1 2 1 1 1 1 1 2 2 1 2 2 1 1 2 1 1 1 1 2 1 1 1 1 2
     [371] 1 2 1 1 1 1 2 1 2 2 1 1 1 2 1 2 2 1 1 2 1 2 1 1 1 2 2 2 2 1 1 1 2 2 2 2 1
     [408] 1 1 2 1 2 1 2 1 1 2 2 1 2 1 2 2 1 1 1 1 2 2 1 2 1 1 2 1 1 1 2 1 1 1 2 2 1
     [445] 1 1 1 1 2 1 1 1 1 2 1 1 1 2 2 1 1 2 2 1 2 2 2 2 1 2 2 1 2 2 2 1 1 2 1 1 2
     [482] 1 2 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2 1 1 1 1 1 1 1 1 1 2 2 1 1 1 2 1 2 1 1
     [519] 1 1 1 1 1 1 1 1 2 1 2 1 1 1 1 1 1 1 2 2 1 1 1 1 1 1 1 1 1 1 1 1 2 2 1 1 1
     [556] 2 1 1 1 1 1 1 1 1 1 1 1 1 1 2 1 2 2 1 1 2 2 1 2 1 1 1 1 1 1 1 1 1 1 2 2 1
     [593] 1 2 2 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2 1 2 2 2 2 2 1 2 1 2 1 1 1 2 1 1 1
     [630] 1 1 2 1 1 2 1 1 1 2 2 1 1 1 1 2 1 1 1 1 1 1 1 1 2 1 1 2 1 2 1 1 1 2 2 1 2
     [667] 1 2 1 2 1 1 1 1 1 1 1 2 1 1 1 1 2 2 2 1 1 1 1 1 2 1 1 1 1 1 1 1 1 1 1 1 2
     [704] 1 1 1 1 1 1 1 1 1 1 2 1 1 1 1 1 1 1 2 1 2 2 2 1 2 1 1 2 1 2 2 1 1 1 1 2 1
     [741] 1 1 2 1 1 1 2 2 1 1 1 1 1 1 2 1 2 2 1 1 2 2 2 1 2 1 1 1 2 1 2 1 1 1 2 1 2
     [778] 2 2 1 2 1 1 1 2 1 1 1 1 1 1 1 1 1 2 1 1 1 1 1 2 1 1 1 1 1 1 2 2 1 2 1 1 1
     [815] 1 2 1 1 1 1 1 1 2 1 2 1 1 2 2 1 1 1 1 1 2 1 1 1 1 1 1 1 2 1 2 1 1 2 2 1 1
     [852] 1 2 2 1 2 1 1 1 1 1 2 1 1 2 2 1 2 2 2 2 2 2 2 2 2 2 2 1 2 2 2 2 2 2 2 2 2
     [889] 2 2 2 2 2 2 2 2 2 2 2 2 2 1 1 1 1 1 1 1 1 1 2 1 1 1 1 1 2 2 1 1 2 1 1 1 1
     [926] 1 2 2 2 1 1 1 1 1 1 2 2 1 1 1 1 1 1 2 1 1 1 1 1 1 2 1 1 2 1 1 1 1 2 2 1 1
     [963] 1 1 1 1 1 1 1 2 2 2 1 2 1 1 1 1 1 2 1 1 1 2 1 1 1 2 1 1 1 2 2 2 2 1 1 1 2
    [1000] 1 2 1 1 2 1 1 1 2 2 1 1 1 2 1 1 1 1 2 1 1 1 1 2 2 1 2 1 1 1 1 1 1 2 2 2 2
    [1037] 1 2 1 2 2 2 1 1 1 2 1 2 1 1 2 1 2 2 2 1 1 2 2 2 1 1 1 2 2 1 1 1 2 2 2 1 1
    [1074] 1 2 1 2 2 1 1 1 1 2 1 2 1 1 1 1 2 1 1 1 1 1 1 1 2 2 2 2 1 1 2 2 1 1 1 1 2
    [1111] 2 2 1 2 1 2 1 1 2 1 1 2 2 2 2 1 2 1 2 1 1 1 1 1 1 2 1 2 2 1 1 2 1 1 1 1 1
    [1148] 2 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 2 1 1 1 1 1 1 2 1 1 1 2 2 2 1 2 2 2 2
    [1185] 2 2 2 1 2 1 1 1 2 2 1 1 1 2 2 2 1 2 1 1 1 2 2 2 1 1 1 1 2 1 1 2 2 1 1 1 1
    [1222] 1 2 1 1 1 1 1 1 2 1 1 1 1 2 1 2 1 1 1 1 2 1 1 2 2 1 2 1 1 1 1 2 2 2 1 2 1
    [1259] 1 1 1 2 1 1 2 1 1 1 1 1 2 1 1 1 1 1 1 1 1 2 2 1 1 1 1 2 1 1 1 1 1 2 1 2 1
    [1296] 2 1 2 2 1 2 1 2 1 1 1 1 2 2 1 1 1 2 1 2 1 1 1 1 1 2 1 1 1 2 1 1 2 1 1 2 1
    [1333] 2 1 1 1 1 2 1 2 2 2 1 1 1 2 2 2 2 2 2 2 2 2 1 1 1 2 1 1 1 1 1 1 1 1 1 2 1
    [1370] 1 2 1 1 1 1 2 1 2 2 1 1 1 1 1 1 1 2 2 2 1 2 1 2 2 1 2 1 2 2 1 2 2 1 2 1

    Within cluster sum of squares by cluster:
    [1] 465.5831 644.5188
     (between_SS / total_SS =  60.5 %)

    Available components:

    [1] "cluster"      "centers"      "totss"        "withinss"     "tot.withinss"
    [6] "betweenss"    "size"         "iter"         "ifault"

```R
test_1.4()
```

    [1] "Success!"

**Question 1.5**
<br> {points: 1}

Use the `augment` function from the `broom` package to get the cluster assignment for each point in the `scaled_beer` data frame.

_Assign your answer to an object named `tidy_beer_cluster_k2`._

```R
# ... <- augment(..., ...)
# your code here
tidy_beer_cluster_k2 <- augment(beer_cluster_k2, scaled_beer)
tidy_beer_cluster_k2
```

<table>
<caption>A tibble: 1405 × 3</caption>
<thead>
	<tr><th scope=col>ibu</th><th scope=col>abv</th><th scope=col>.cluster</th></tr>
	<tr><th scope=col>&lt;dbl[,1]&gt;</th><th scope=col>&lt;dbl[,1]&gt;</th><th scope=col>&lt;fct&gt;</th></tr>
</thead>
<tbody>
	<tr><td>0.66605490</td><td>0.08000109</td><td>2</td></tr>
	<tr><td>1.89900237</td><td>2.87899086</td><td>2</td></tr>
	<tr><td>0.08811077</td><td>1.40583835</td><td>2</td></tr>
	<tr><td>⋮</td><td>⋮</td><td>⋮</td></tr>
	<tr><td> 0.28075881</td><td> 0.006343468</td><td>1</td></tr>
	<tr><td> 0.08811077</td><td> 0.521946846</td><td>2</td></tr>
	<tr><td>-0.10453727</td><td>-0.361944659</td><td>1</td></tr>
</tbody>
</table>

```R
test_1.5()
```

    [1] "Success!"

**Question 1.6**
<br> {points: 1}

Create a scatter plot of `abv` on the y-axis versus `ibu` on the x-axis (using the data in `tidy_beer_cluster_k2`) where the points are labelled by their cluster assignment. Name the plot object `tidy_beer_cluster_k2_plot`.

```R
# your code here
tidy_beer_cluster_k2_plot <- ggplot(tidy_beer_cluster_k2, aes(x = ibu, y = abv, color = .cluster)) +
                                geom_point() + labs(x = "International Bittering Units", y = "Alcoholic Content by Volume", colour = "Cluster Assingment")
tidy_beer_cluster_k2_plot
```

![png](output_32_0.png)

```R
test_1.6()
```

    [1] "Success!"

**Question 1.7.1** Multiple Choice:
<br> {points: 1}

We do not know, however, that two clusters ($k$ = 2) is the best choice for this data set. What can we do to choose the best K?

A. Perform _cross-validation_ for a variety of possible $k$'s. Choose the one where within-cluster sum of squares distance starts to _decrease less_.

B. Perform _cross-validation_ for a variety of possible $k$'s. Choose the one where the within-cluster sum of squares distance starts to _decrease more_.

C. Perform _clustering_ for a variety of possible $k$'s. Choose the one where within-cluster sum of squares distance starts to _decrease less_.

D. Perform _clustering_ for a variety of possible $k$'s. Choose the one where the within-cluster sum of squares distance starts to _decrease more_.

_Assign your answer to an object called `answer1.7.1`. Make sure your answer is an uppercase letter and is surrounded by quotation marks (e.g. `"F"`)._

```R
# your code here
answer1.7.1 <- "C"
```

```R
test_1.7.1()
```

    [1] "Success!"

**Question 1.7.2**
<br> {points: 1}

Use the `glance` function from the `broom` library to get the model-level statistics for the clustering we just performed, including total within-cluster sum of squares.

_Assign your answer to an object named `beer_cluster_k2_model_stats`._

**Note: Do not pass `tidy_beer_cluster_k2` or `scaled_beer` into the `glance` function. This will cause the R kernel to crash.**

```R
# your code here
beer_cluster_k2_model_stats <- glance(beer_cluster_k2)
beer_cluster_k2_model_stats
```

<table>
<caption>A tibble: 1 × 4</caption>
<thead>
	<tr><th scope=col>totss</th><th scope=col>tot.withinss</th><th scope=col>betweenss</th><th scope=col>iter</th></tr>
	<tr><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;int&gt;</th></tr>
</thead>
<tbody>
	<tr><td>2808</td><td>1110.102</td><td>1697.898</td><td>1</td></tr>
</tbody>
</table>

```R
test_1.7.2()
```

    [1] "Success!"

**Question 1.8**
<br> {points: 1}

Let's now choose the best K for this clustering problem. To do this we need to create a tibble with a column named `k`, where $k$ has values 1 to 10.

_Assign your answer to an object named `beer_ks`._

```R
# your code here
beer_ks <- tibble(k = 1:10)
beer_ks
```

<table>
<caption>A tibble: 10 × 1</caption>
<thead>
	<tr><th scope=col>k</th></tr>
	<tr><th scope=col>&lt;int&gt;</th></tr>
</thead>
<tbody>
	<tr><td>1</td></tr>
	<tr><td>2</td></tr>
	<tr><td>3</td></tr>
	<tr><td>⋮</td></tr>
	<tr><td> 8</td></tr>
	<tr><td> 9</td></tr>
	<tr><td>10</td></tr>
</tbody>
</table>

```R
test_1.8()
```

    [1] "Success!"

**Question 1.9**
<br> {points: 1}

Next we use `mutate` to create a new column named `models` in `beer_ks`, where we use `map` to apply the `kmeans` function to our `scaled_beer` data set for each of the $k$'s .

> This is a more complicated use of the `map` function than we have seen previously in the course. This is because we need to iterate over the different values of $k$, which is the second argument to the `kmeans` function. In the past, we have used `map` only to iterate over values of the first argument of a function. Since that is the default, we could simply write `map(data_frame, function_name)`. This won’t work here; we need to provide our data frame as the first argument to the `kmeans` function. You might want to refer back to the section of the textbook that explains before completing this question: [K-means in R](https://ubc-dsci.github.io/introduction-to-datascience/clustering.html#k-means-in-r)

This will give us a data frame with two columns, the first being `k`, which holds the values of the $k$'s we mapped (i.e, iterated) over. The second will be `models`, which holds the $k$-means model fits for each of the $k$'s we mapped over.

> This second column is a new type of column, that we have not yet encountered in this course. It is called a list column. It can contain more complex objects, like models and even data frames (as we will see in a later question). In Jupyter it is easier to preview and understand this more complex data frame using the `print` function as opposed to calling the data frame itself as we usually do. This is a current limitation of Jupyter's rendering of R's output and will hopefully be fixed in the future.

_Assign your answer to an object named `beer_clustering`._

```R
set.seed(1234) # DO NOT REMOVE
# ... <- ... %>%
#     mutate(models = map(..., ~kmeans(scaled_beer, .x)))

# your code here
beer_clustering <- beer_ks %>%
    mutate(models = map(k, ~kmeans(scaled_beer, .x)))
print(beer_clustering)
```

    [90m# A tibble: 10 x 2[39m
           k models
       [3m[90m<int>[39m[23m [3m[90m<list>[39m[23m
    [90m 1[39m     1 [90m<kmeans>[39m
    [90m 2[39m     2 [90m<kmeans>[39m
    [90m 3[39m     3 [90m<kmeans>[39m
    [90m 4[39m     4 [90m<kmeans>[39m
    [90m 5[39m     5 [90m<kmeans>[39m
    [90m 6[39m     6 [90m<kmeans>[39m
    [90m 7[39m     7 [90m<kmeans>[39m
    [90m 8[39m     8 [90m<kmeans>[39m
    [90m 9[39m     9 [90m<kmeans>[39m
    [90m10[39m    10 [90m<kmeans>[39m

```R
test_1.9()
```

    [1] "Success!"

**Question 2.0**
<br> {points: 1}

Next we use `mutate` again to create a new column called `model_statistics` where we use `map` to apply the `glance` function to each of our models (in the `models` column) to get the model-level statistics (this is where we can get the value for total within sum of squares that we use to choose K).

> Here, because we are interating over the first argument to the `glance` function (which is the `models` column), we can use the simpler syntax for `map` as we did earlier in the course.

_Assign your answer to an object named `beer_model_stats`._

```R
# ... <- ... %>%
#     mutate(... = map(models, ...))

# your code here
beer_model_stats <- beer_clustering %>%
    mutate(model_statistics = map(models, glance))
print(beer_model_stats)
```

    [90m# A tibble: 10 x 3[39m
           k models   model_statistics
       [3m[90m<int>[39m[23m [3m[90m<list>[39m[23m   [3m[90m<list>[39m[23m
    [90m 1[39m     1 [90m<kmeans>[39m [90m<tibble [1 × 4]>[39m
    [90m 2[39m     2 [90m<kmeans>[39m [90m<tibble [1 × 4]>[39m
    [90m 3[39m     3 [90m<kmeans>[39m [90m<tibble [1 × 4]>[39m
    [90m 4[39m     4 [90m<kmeans>[39m [90m<tibble [1 × 4]>[39m
    [90m 5[39m     5 [90m<kmeans>[39m [90m<tibble [1 × 4]>[39m
    [90m 6[39m     6 [90m<kmeans>[39m [90m<tibble [1 × 4]>[39m
    [90m 7[39m     7 [90m<kmeans>[39m [90m<tibble [1 × 4]>[39m
    [90m 8[39m     8 [90m<kmeans>[39m [90m<tibble [1 × 4]>[39m
    [90m 9[39m     9 [90m<kmeans>[39m [90m<tibble [1 × 4]>[39m
    [90m10[39m    10 [90m<kmeans>[39m [90m<tibble [1 × 4]>[39m

```R
test_2.0()
```

    [1] "Success!"

> Here when we create our third column, called `model_statistics`, we can see it is another list column! This time it contains data frames instead of models! Run the cell below to see how you can look at the data frame that is stored as the first element of the `model_statistics` column (model where we used $k$ = 1):

```R
beer_model_stats %>%
    slice(1) %>%
    pull(model_statistics)
```

<ol>
	<li><table>
<caption>A tibble: 1 × 4</caption>
<thead>
	<tr><th scope=col>totss</th><th scope=col>tot.withinss</th><th scope=col>betweenss</th><th scope=col>iter</th></tr>
	<tr><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;dbl&gt;</th><th scope=col>&lt;int&gt;</th></tr>
</thead>
<tbody>
	<tr><td>2808</td><td>2808</td><td>-2.273737e-12</td><td>1</td></tr>
</tbody>
</table>
</li>
</ol>

**Question 2.1**
<br> {points: 1}

Now we use the `unnest` function to expand the data frames in the `model_statistics` column so that we can access the values for total within sum of squares as a column.

_Assign your answer to an object named `beer_clustering_unnested`._

```R
# ... <- ... %>% unnest(model_statistics)
# your code here
beer_clustering_unnested <- beer_model_stats %>% unnest(model_statistics)
print(beer_clustering_unnested)
```

    [90m# A tibble: 10 x 6[39m
           k models   totss tot.withinss betweenss  iter
       [3m[90m<int>[39m[23m [3m[90m<list>[39m[23m   [3m[90m<dbl>[39m[23m        [3m[90m<dbl>[39m[23m     [3m[90m<dbl>[39m[23m [3m[90m<int>[39m[23m
    [90m 1[39m     1 [90m<kmeans>[39m [4m2[24m808.        [4m2[24m808. -[31m2[39m[31m.[39m[31m27[39m[90me[39m[31m-12[39m     1
    [90m 2[39m     2 [90m<kmeans>[39m [4m2[24m808.        [4m1[24m110.  1.70[90me[39m+ 3     1
    [90m 3[39m     3 [90m<kmeans>[39m [4m2[24m808.         803.  2.00[90me[39m+ 3     3
    [90m 4[39m     4 [90m<kmeans>[39m [4m2[24m808.         624.  2.18[90me[39m+ 3     3
    [90m 5[39m     5 [90m<kmeans>[39m [4m2[24m808.         567.  2.24[90me[39m+ 3     3
    [90m 6[39m     6 [90m<kmeans>[39m [4m2[24m808.         417.  2.39[90me[39m+ 3     6
    [90m 7[39m     7 [90m<kmeans>[39m [4m2[24m808.         361.  2.45[90me[39m+ 3     6
    [90m 8[39m     8 [90m<kmeans>[39m [4m2[24m808.         318.  2.49[90me[39m+ 3     5
    [90m 9[39m     9 [90m<kmeans>[39m [4m2[24m808.         294.  2.51[90me[39m+ 3     4
    [90m10[39m    10 [90m<kmeans>[39m [4m2[24m808.         264.  2.54[90me[39m+ 3     6

```R
test_2.1()
```

    [1] "Success!"

beer_clustering_unnested**Question 2.2**
<br> {points: 1}

We now have the the values for total within-cluster sum of squares for each model in a column (`tot.withinss`). Let's use it to create a line plot with points of total within-cluster sum of squares versus k, so that we can choose the best number of clusters to use.

_Assign your plot to an object called `choose_beer_k`. Total within-cluster sum of squares should be on the y-axis and K should be on the x-axis. Remember to follow the best visualization practices, including adding human-readable labels to your plot._

```R
options(repr.plot.width = 8, repr.plot.height = 7)

# your code here
choose_beer_k <- ggplot(beer_clustering_unnested, aes(x = k, y = tot.withinss)) + geom_point() + geom_line() +
                labs(x = "Model", y = "Total Within-Cluster Sum of Squares")
choose_beer_k
```

![png](output_55_0.png)

```R
test_2.2()
```

    [1] "Success!"

**Question 2.3**
<br> {points: 1}

From the plot above, which $k$ should we choose?

_Assign your answer to an object called `answer2.3`. Make sure your answer is a single numerical character surrounded by quotation marks._

```R
# your code here
answer2.3 <- "2"
```

```R
test_2.3()
```

    [1] "Success!"

**Question 2.4**
<br> {points: 1}

Why did we choose the $k$ we chose above?

A. It had the greatest total within-cluster sum of squares

B. It had the smallest total within-cluster sum of squares

C. Decreasing $k$ further than this only decreased the total within-cluster sum of squares a small amount

D. Decreasing $k$ further than this only increased the total within-cluster sum of squares a small amount

_Assign your answer to an object called `answer2.4`. Make sure your answer is an uppercase letter and is surrounded by quotation marks (e.g. `"F"`)._

```R
# your code here
answer2.4 <- "C"
```

```R
test_2.4()
```

    [1] "Success!"

**Question 2.5** Multiple Choice:
<br> {points: 1}

What can we conclude from our analysis? How many different types of hoppy craft beer are there in this data set using the two variables we have?

A. 1

B. 2

C. 3

D. 4

_Assign your answer to an object called `answer2.5`. Make sure your answer is an uppercase letter and is surrounded by quotation marks (e.g. `"F"`)._

```R
# your code here
answer2.5 <- "B"
```

```R
test_2.5()
```

    [1] "Success!"

**Question 2.6** True or false:
<br> {points: 1}

Our analysis might change if we added additional variables, true or false?

_Assign your answer to an object called `answer2.6`. Make sure your answer is written in lowercase and is surrounded by quotation marks (e.g. `"true"` or `"false"`)._

```R
# your code here
answer2.6 <-"true"
```

```R
test_2.6()
```

    [1] "Success!"

```R
source("cleanup_worksheet_10.R")
```

```R

```
