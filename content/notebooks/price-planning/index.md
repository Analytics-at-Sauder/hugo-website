---
title: "Price Versioning"
description: "In this project, we will lead you through examples to talk about why creating different version can bring more profits to the companies while the customers are still willing to pay for it."
author: "Hao Zheng"
date: 2021-06-10T00:22:40-07:00
lastmod: 2021-06-10T00:22:40-07:00
draft: false
images: []
toc: true
menu:
  notebooks:
    parent: "notebooks"
weight: 50
topics:
skills:
  - Linear Programming/Optimization
---

#### Author: Hao Zheng

The Versioning is a business practice in which a company produces different models of essentially the same product and then charges different prices for each model. In this way, the business is attempting to attract higher prices based on the value a customer perceives.

In this project, we will lead you through examples to talk about why creating different version can bring more profits to the companies while the customers are still willing to pay for it. We encourage you to create your own Jupytor notebook and follow along. You can also download this notebook together with any affiliated data in the [Notebooks and Data](https://github.com/Master-of-Business-Analytics/Notebooks_and_Data) GitHub repository. Alternatively, if you do not have Python or Jupyter Notebook installed yet, you may experiment with a virtual notebook by launching Binder or Syzygy below (learn more about these two tools in the [Resource](https://analytics-at-sauder.github.io/resource.html) tab).

<a href="https://ubc.syzygy.ca/jupyter/hub/user-redirect/git-pull?repo=https%3A%2F%2Fgithub.com%2FAnalytics-at-Sauder%2FNB0002_Price_Versioning&urlpath=tree%2FNB0002_Price_Versioning%2Fnb0002_price_versioning.ipynb&branch=master" target="_blank" class="button">Launch Syzygy (UBC)</a>

<a href="https://pims.syzygy.ca/jupyter/hub/user-redirect/git-pull?repo=https%3A%2F%2Fgithub.com%2FAnalytics-at-Sauder%2FNB0002_Price_Versioning&urlpath=tree%2FNB0002_Price_Versioning%2Fnb0002_price_versioning.ipynb&branch=master" target="_blank" class="button">Launch Syzygy (Google)</a>

<a href="https://mybinder.org/v2/gh/Analytics-at-Sauder/NB0002_Price_Versioning/master?filepath=nb0002_price_versioning.ipynb" target="_blank" class="button">Launch Binder</a>

## Business Problems

---

In real world, it is common for the companies to see that different type of customers will have different price in their heart for the same product. For example, for the same bottle of mineral water, customers who care about their own health might pay 5 dollar for it. Because they thinkit is good for their health while the majority of customers only wills to pay less than 1 dollar for it because it is just regular water in their mind. Due to moral restriction and legislation issue, one product(SKU) can only have 1 price, so the company might have to sell the bottle water for less than $1 in order to reach to the majority of customers.

So is there a way to gain the extra 4 dollar from some of the customer? Here's where versioning will come to place. By providing different values and setting price appropriately, the company can possibly get more from their high value customers. We will show it in the following example.

In the following examples, we make two major assumptions:

For a single product offering, we assume that customers choose the product as long as the WTP(Willingness To Pay)is greater than the price.

For a multiple product offering, we assume that consumers choose the product that gives them the highest surplus.

### Single Version

```python
import pandas as pd

from bokeh.io import output_notebook, show,output_file
from bokeh.plotting import figure
from bokeh.embed import file_html
```

```python
lst_name = ['Abby',"Bob",'Cindy','Desmond','Eva']
lst_WTP = [8,9,10,19,20]
df = pd.DataFrame(list(zip(lst_name,lst_WTP)), columns = ['Cluster Names','WTP'])
print(df.to_string(index=False))
df_1 = df
```

    Cluster Names  WTP
             Abby    8
              Bob    9
            Cindy   10
          Desmond   19
              Eva   20

Here we suppose we have five cluster of customers who have different WTP for the same movie ticket. These are the potential customers who can buy the movie tickets. As the manager of the cinema, you have to set a price to make the most out of the movie.

There are five possible points to set the price which are the WTPs of each cluster because the customers will buy the movie ticket as long as the WTP is greater than the price.

```python
total_profit_lst = []
for i in lst_WTP:
    profit = 0
    for k in lst_WTP:
        if int(i) <= int(k):
            profit = profit + int(i)
    total_profit_lst.append(profit)
df_single = pd.DataFrame(list(zip(lst_WTP,total_profit_lst)), columns = ['Ticket Price','Total Profit'])
print(df_single.to_string(index=False))
```

     Ticket Price  Total Profit
                8            40
                9            36
               10            30
               19            38
               20            20

We can see that the maximum profit that can be gained is $40 by setting the price to 8 dollar so that all the clusters will buy the moview ticket. However, is there a way to gain more profit from these customers?

### Multiple Version

We can try to provide a different version to customers with higher WTP. We can sell the ticket a higher price by providing the customers premium seating which incur almost no additional cost, but increase the profit. Let's try to apply this methodology here into these five customers.

```python
lst_WTP_high = [8,9,10,40,50]
df['WTP_high'] = lst_WTP_high
df.columns = ['Cluster Names', "WTP_low","WTP_high"]
print(df.to_string(index=False))
df_2 = df
```

    Cluster Names  WTP_low  WTP_high
             Abby        8         8
              Bob        9         9
            Cindy       10        10
          Desmond       19        40
              Eva       20        50

Cluster of customers might have different WTP for two different versions because some of them want to enjoy premium services.

```python
price_Low = 8
price_High = 28.99
```

Here we test the total profit if we set the low end version ticket price to 8 and high end version ticket price to 28.99.

```python
surplus = [(8-8,8-28.99),
           (9-8,9-28.99),
           (10-8,10-28.99),
           (19-8,40-28.99),
           (20-8,50-28.99)]

df_surplus = pd.DataFrame(surplus,columns = ['surplus for low end ticket','surplus for high end ticket'],index = lst_name)
print(df_surplus)
print("="*20)
Desmond_data = df_surplus.loc['Desmond',:]; print(Desmond_data)
```

             surplus for low end ticket  surplus for high end ticket
    Abby                              0                       -20.99
    Bob                               1                       -19.99
    Cindy                             2                       -18.99
    Desmond                          11                        11.01
    Eva                              12                        21.01
    ====================
    surplus for low end ticket     11.00
    surplus for high end ticket    11.01
    Name: Desmond, dtype: float64

Here we can see the corresponding surplus for each of the cluster. Here we want to focus on Desmond's surplus. Desmond's surplus for high end ticket is 0.01 more than his surplus for low end ticket which means he will pick the high end ticket for the additional surplus. We successfully attract Desmond to buy the high end ticket.

---

```python
profit = 0
for index, row in df_surplus.iterrows():
    if row['surplus for low end ticket'] >= row['surplus for high end ticket']:
        profit = profit + price_Low
    else:
        profit = profit + price_High
print("The new profit is $"+ str(round(profit,2)))
```

    The new profit is $81.98

## Practice Case with different options

---

Here we have the final scenario, where you will be having more than 2 versions. In this scenario, you can use the optimization tools that we would introduce in other projects to find out the best solution based on different number of versions you choose to provide, here we provide an interactive case for you to play around.

```python
lst_WTP_medium = [8,9,10,25,30]
df['WTP_medium'] = lst_WTP_medium
df.columns = ['Cluster Names', "WTP_low","WTP_high","WTP_medium"]
new_order = [0,1,3,2] #switching columns order
new_df = df[df.columns[new_order]]
print(new_df.to_string(index=False))
```

    Cluster Names  WTP_low  WTP_medium  WTP_high
             Abby        8           8         8
              Bob        9           9         9
            Cindy       10          10        10
          Desmond       19          25        40
              Eva       20          30        50

```python
def ver_opt(val,price):
    if val == 1:
        selection_lst = []
        revenue = 0
        for i in lst_WTP:
            if int(i) >= int(price[0]):
                selection_lst.append(1)
                revenue = revenue + price[0]
            else:
                selection_lst.append(0)
        return selection_lst, revenue
    if val == 2:
        selection_lst = []
        revenue = 0
        surplus_high = df_2['WTP_high'] -price[1]
        surplus_low = df_2['WTP_low'] - price[0]
        for i in range(len(df_2.index)):
            if surplus_high[i] >= surplus_low[i]:
                revenue = revenue + price[1]
                selection_lst.append(1)
            else:
                revenue = revenue + price[0]
                selection_lst.append(0)
        return selection_lst,revenue
    if val == 3:
        selection_lst = []
        revenue = 0
        surplus_high = new_df['WTP_high'] -price[2]
        surplus_medium = new_df['WTP_medium'] - price[1]
        surplus_low = df_2['WTP_low'] - price[0]
        for i in range(len(new_df.index)):
            if surplus_high[i] == max(surplus_high[i],surplus_medium[i], surplus_low[i]):
                # It's rational that people go for the best service
                # if they are indifferent from different types of service
                revenue = revenue + price[2]
                selection_lst.append(2)
            elif surplus_medium[i] == max(surplus_high[i],surplus_medium[i], surplus_low[i]):
                revenue = revenue + price[1]
                selection_lst.append(1)
            elif surplus_low[i] == max(surplus_high[i],surplus_medium[i], surplus_low[i]):
                revenue = revenue + price[0]
                selection_lst.append(0)
        return selection_lst,revenue
```

```python
version = input("how many version? /1-3: ")
if int(version) == 1:
    price = [int(x) for x in input("Enter one price: ").split()]
    print("The only Price is: $", price[0])
elif int(version) == 2:
    price = [int(x) for x in input("Enter two prices: ").split()]
    print("First Price is: $", price[0])
    print("Second Price is: $", price[1])
elif int(version) == 3:
    price = [int(x) for x in input("Enter three prices: ").split()]
    print("First Price is: $", price[0])
    print("Second Price is: $", price[1])
    print("Third Price is: $", price[2])

selection_lst, revenue = ver_opt(int(version),price)

```

    how many version? /1-3: 2
    Enter two prices: 10 30
    First Price is: $ 10
    Second Price is: $ 30

In the following plot, V1 indicates the single version scenario:

```python
print("The total revenue is: $",revenue)
output_notebook()
p = figure(plot_width=450, plot_height=450,title = "version result",toolbar_location="below",x_range=(-0.5, 2.5))
nonselection_color="blue"
p.title.text_color = "olive"
p.title.text_font = "times"
p.title.text_font_size = "14pt"
p.title.text_font_style = "italic"
p.yaxis.ticker = [1, 2, 3, 4, 5]
p.yaxis.major_label_overrides = {1: 'Abby', 2: 'Bob', 3: 'Cindy',4: 'Desmond', 5: 'Eva'}
p.xaxis.ticker = [0, 1, 2 , 3]
p.xaxis.major_label_overrides = {0: 'Low/no purchase(V1)', 1: 'Medium/purchase(V1)', 2: 'High Version'}
p.x(selection_lst, [1, 2, 3, 4, 5],size =10, color="firebrick", alpha=0.6, line_width = 2)
show(p)
```

    The total revenue is: $ 90

<div class="bk-root">
    <a href="https://bokeh.pydata.org" target="_blank" class="bk-logo bk-logo-small bk-logo-notebook"></a>
    <span id="11868">Loading BokehJS ...</span>
</div>

<div class="bk-root" id="dbfde975-e7b2-4759-a582-c92dfdb4b226" data-root-id="11869"></div>

```python
# If you want to show the picture in html
#from bokeh.embed import file_html
#from bokeh.resources import CDN

#html = file_html(p,CDN,"MY PLOT")
#print(html)
```

## Conclusion

---

It is worth noticing that the model we are using is lacking several important factor that we should take into consideration like the cost of service. However, you can freely adjust the model based on your preference. The true important point here is that with the help of versioning, we are able to evaluate the sales options more wisely and generate more revenue out from the same group of customers.
