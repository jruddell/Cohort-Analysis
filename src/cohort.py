from collections import defaultdict
import csv
import datetime as dt
from pytz import timezone
import pytz
from dateutil import parser as date_parser

class CohortRow(object):
    week_range = None       # (d1, d2) tuple
    week_label = None       #'7/1-7/7'
    total_customers = None
    relative_weeks = None   # array of objects {num_orders: 30, num_firsts: 20}
    current_week = None
    
    def __init__(self, week_label, current_week):
        self.week_label = week_label
        self.total_customers = 0
        self.relative_weeks = []
        self.current_week = current_week


class Order(object):
    id = None
    order_id = None
    customer_id = None
    order_date = None
    
    def __init__(self, id, order_id, customer_id, order_date):
        self.id = id
        self.order_id = order_id
        self.customer_id = customer_id
        self.order_date = order_date
  
    @classmethod
    def from_row(cls, row):
        if not row and len(row) < 4:
            raise Exception('invalid row')
            
        return cls(
            int(row[0]),
            int(row[1]),
            int(row[2]),
            CohortBuilder.parse_date(row[3])
        )

class Customer(object):
    id = None
    created_at = None
    
    def __init__(self, id, created_at):
        self.id = id
        self.created_at = created_at
  
    @classmethod
    def from_row(cls, row):
        if not row and len(row) < 2:
            raise Exception('invalid row')

        return cls(
            int(row[0]),
            CohortBuilder.parse_date(row[1])
        )


class CohortBuilder(object):
    total_weeks = 8  # number of weeks to look back
    time_zone = timezone('US/Pacific')  # display results in timezone
    today = None  # default starting day for the cohort report
    
    __rows = None
    
    @property  # list of <CohortRow>
    def rows(self):
        return self.__rows

    def __init__(self, today='2015-07-07 23:34:39'):
        self.today = CohortBuilder.parse_date(today)
        self.__rows = []
        
        for i in range(1, self.total_weeks + 1):
            start = self.today - dt.timedelta(days=(7 * i))
            end = self.today - dt.timedelta(days=(7 * (i-1)))
            current_week = str(start.month) + '/' + str(start.day) + ' - ' + str(end.month) + '/' + str(end.day)
            
            # add a row with no columns for the range of weeks
            self.__rows.append(CohortRow(current_week, start))
        
        
        # populate customers from data file
        customers = self.get_customers('src/customers.csv')
        
        # populate orders from data file
        orders = CohortBuilder.get_orders('src/orders.csv')
        
        # prepare data model array on `self.__rows`
        self.__generate(customers, orders)
  
  
    @staticmethod
    def parse_date(date_str):
        # configure a timezone from a date string
        d = date_parser.parse(date_str)             # convert to datetime object
        d = pytz.utc.localize(d)                    # assign utc timezone to the unaware utc date
        d = d.astimezone(CohortBuilder.time_zone)   # convert time to configurable timezone
        return d
        
    @staticmethod
    def find_future_week(start, current, weeks_until):
        # always check to make sure your recursive function isn't out of range
        if current < start or weeks_until > (CohortBuilder.total_weeks -1): # counting for 0 index on total weeks
            return None
        if current >= start and current <= start + dt.timedelta(days=7):
            # i found my week
            return weeks_until
        else:
            # recursively call the function again with a new count and start date 7 days ahead
            return CohortBuilder.find_future_week(start + dt.timedelta(days=7), current, weeks_until + 1)

    @staticmethod
    def find_prev_week(start, current, weeks_ago):
        # always check to make sure your recursive function isn't out of range
        if current > start or weeks_ago > (CohortBuilder.total_weeks -1): # counting for 0 index on total weeks
            return None
        if current <= start and current >= start - dt.timedelta(days=7):
            # i found my week
            return weeks_ago
        else:
            # recursively call the function again with a new count and start date 7 days ago
            return CohortBuilder.find_prev_week(start - dt.timedelta(days=7), current, weeks_ago + 1)
        
    def get_customers(self, path):
        customers = {} # __customer_id_map[cust_id] = <Customer>

        with open(path, 'rb') as f:
            reader = csv.reader(f)
            reader.next()  # first row contains titles

            for row in reader:
                customer = Customer.from_row(row)
                # create user hash table off of user id
                customers[customer.id] = customer

                # search for the week number the user was created in
                weeks_ago = CohortBuilder.find_prev_week(self.today, customer.created_at, 0)
                if weeks_ago is None:
                    continue

                model = self.__rows[weeks_ago]
                model.total_customers += 1

        return customers

    @staticmethod
    def get_orders(path):
        orders = defaultdict(list) # e.g. __orders_by_customer[cust_id] = [<Order1>, <Order2>, ...]
        
        with open(path, 'rb') as f:
            reader = csv.reader(f)
            reader.next() # first row contains headers

            for row in reader:
                order = Order.from_row(row)
                orders[order.customer_id].append(order)

        return orders

    def __generate(self, customers, orders): 

        for cust_id, orders in orders.iteritems():
            customer = customers.get(cust_id, None)

            # ignore unknown customers
            if not customer:
                continue
  
            # how many weeks ago was this order
            weeks_ago = CohortBuilder.find_prev_week(self.today, customer.created_at, 0)
            if weeks_ago is None:
                continue
            
            model = self.__rows[weeks_ago]

            # set up sub weeks per week
            user_first_order = None
            prev_order_week = None
            user_first_order_flag = False

            if len(orders) > 1:
                orders.sort(key=lambda o: o.order_date)
                user_first_order = orders[0]
            elif len(orders) == 1:
                user_first_order = orders[0]

            for order in orders:
                order_week = self.find_future_week(customer.created_at, order.order_date, 0)
                if order_week is None:
                    continue

                if order_week == prev_order_week:  # order_date is sorted chronologically so the previous will be side by side
                    continue  # weve already counted this user for this order_locationation.

                if len(model.relative_weeks) > order_week:
                    model.relative_weeks[order_week]['num_orders'] += 1
                else:
                    for i in range(len(model.relative_weeks), order_week):
                        model.relative_weeks.append({'num_orders': 0, 'num_firsts': 0})
                    model.relative_weeks.append({'num_orders': 1, 'num_firsts': 0})

                
                if not user_first_order_flag and user_first_order and self.find_future_week(customer.created_at, user_first_order.order_date, 0) == order_week:
                    user_first_order_flag = True
                    model.relative_weeks[order_week]['num_firsts'] += 1

                prev_order_week = order_week
