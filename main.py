from flask import Flask, render_template, json
import config
from flask_restful import fields, marshal, marshal_with

app = Flask(__name__, static_folder='build')
config.init(app)
week_fields = {'num_firsts': fields.Integer, 'num_orders': fields.Integer}
row_fields = { 
    'current_week': fields.DateTime,
    'week_label': fields.String,
    'total_customers': fields.Integer,
    'relative_weeks': fields.Nested(week_fields)  
}
cohort_fields = {'rows': fields.List(fields.Nested(row_fields))}

@app.errorhandler(404)
def page_not_found(e):
    return 'Sorry, nothing at this URL.', 404


@app.route('/')
def render_html_index():
    return render_template('index.html')

@app.route('/cohort-data')
def cohort_data():
    from src.cohort import CohortBuilder
    model = CohortBuilder()
    cohort_rows = marshal(model, cohort_fields)
    return json.dumps(cohort_rows)

if __name__ == '__main__':
    app.run(port=3000)
