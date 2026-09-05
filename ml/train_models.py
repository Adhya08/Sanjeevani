import json
import os
import numpy as np
import pandas as pd
from sklearn.tree import DecisionTreeRegressor

# Ensure directories exist
os.makedirs('data/synthetic', exist_ok=True)
os.makedirs('backend/src/models', exist_ok=True)

print("Step 1: Generating Grounded Synthetic Entities...")

# Produce details: Optimal temperatures, optimal humidity, baseline shelf-life (days)
# and average AGMARKNET mandi price per kg (in ₹)
PRODUCE_SPECS = {
    'Tomato': {'opt_temp': 12, 'opt_hum': 90, 'base_shelf': 7, 'price_range': (20, 35)},
    'Potato': {'opt_temp': 7, 'opt_hum': 95, 'base_shelf': 30, 'price_range': (15, 25)},
    'Onion': {'opt_temp': 4, 'opt_hum': 70, 'base_shelf': 45, 'price_range': (18, 30)},
    'Cabbage': {'opt_temp': 2, 'opt_hum': 95, 'base_shelf': 14, 'price_range': (12, 22)},
    'Carrot': {'opt_temp': 2, 'opt_hum': 95, 'base_shelf': 21, 'price_range': (25, 45)},
    'Banana': {'opt_temp': 14, 'opt_hum': 85, 'base_shelf': 6, 'price_range': (25, 40)},
    'Mango': {'opt_temp': 13, 'opt_hum': 88, 'base_shelf': 8, 'price_range': (50, 120)},
    'Apple': {'opt_temp': 1, 'opt_hum': 90, 'base_shelf': 90, 'price_range': (80, 140)},
    'Orange': {'opt_temp': 4, 'opt_hum': 85, 'base_shelf': 21, 'price_range': (40, 75)},
    'Spinach': {'opt_temp': 0, 'opt_hum': 95, 'base_shelf': 4, 'price_range': (15, 30)},
    'Cauliflower': {'opt_temp': 0, 'opt_hum': 95, 'base_shelf': 14, 'price_range': (20, 35)},
    'Grapes': {'opt_temp': 1, 'opt_hum': 90, 'base_shelf': 14, 'price_range': (60, 110)},
    'Guava': {'opt_temp': 8, 'opt_hum': 90, 'base_shelf': 10, 'price_range': (30, 55)},
    'Brinjal': {'opt_temp': 12, 'opt_hum': 90, 'base_shelf': 7, 'price_range': (15, 25)}
}


# 1. Generate Shelf-Life & Waste-Risk Dataset (M3)
print("Step 2: Training Shelf-Life & Waste-Risk Model...")
np.random.seed(42)
n_samples_m3 = 10000

m3_rows = []
for _ in range(n_samples_m3):
    prod = np.random.choice(list(PRODUCE_SPECS.keys()))
    spec = PRODUCE_SPECS[prod]
    
    # Random storage conditions
    temp = np.random.uniform(0, 35) # Temp in Celsius
    hum = np.random.uniform(50, 100) # Humidity in %
    days_since_harvest = np.random.uniform(0, spec['base_shelf'] * 1.5)
    
    # Calculate decay factor
    temp_dev = abs(temp - spec['opt_temp'])
    hum_dev = abs(hum - spec['opt_hum'])
    
    decay_rate = 1.0 + (temp_dev * 0.15) + (hum_dev * 0.05)
    effective_days = days_since_harvest * decay_rate
    
    # Waste Risk calculation (0 to 100)
    risk = min(100.0, max(0.0, (effective_days / spec['base_shelf']) * 100.0))
    
    # Remaining days prediction
    rem_days = max(0.0, spec['base_shelf'] - (days_since_harvest / decay_rate))
    
    m3_rows.append({
        'produce': prod,
        'temp': temp,
        'hum': hum,
        'days_since_harvest': days_since_harvest,
        'risk': risk,
        'rem_days': rem_days
    })

df_m3 = pd.DataFrame(m3_rows)
# Encode categorical produce
prod_mapping = {p: i for i, p in enumerate(PRODUCE_SPECS.keys())}
df_m3['produce_enc'] = df_m3['produce'].map(prod_mapping)

X_m3 = df_m3[['produce_enc', 'temp', 'hum', 'days_since_harvest']]
y_risk = df_m3['risk']
y_rem = df_m3['rem_days']

# Train decision tree for risk score
dt_risk = DecisionTreeRegressor(max_depth=6, random_state=42)
dt_risk.fit(X_m3, y_risk)

# Train decision tree for remaining days
dt_rem = DecisionTreeRegressor(max_depth=6, random_state=42)
dt_rem.fit(X_m3, y_rem)

# 2. Generate Demand Prediction Dataset (M4)
print("Step 3: Training Demand Prediction Model...")
n_samples_m4 = 15000
m4_rows = []
for _ in range(n_samples_m4):
    prod = np.random.choice(list(PRODUCE_SPECS.keys()))
    spec = PRODUCE_SPECS[prod]
    
    # Buyer traits
    buyer_type = np.random.choice([0, 1, 2]) # 0=retailer, 1=restaurant, 2=ngo
    rolling_avg = np.random.uniform(10, 200) # rolling average volume in kg
    
    # Season, weather, festival, price factors
    month = np.random.randint(1, 13)
    is_festival = 1 if np.random.rand() < 0.15 else 0
    weather_rain = 1 if np.random.rand() < 0.25 else 0
    weather_heat = 1 if np.random.rand() < 0.2 else 0
    price_level = np.random.uniform(spec['price_range'][0], spec['price_range'][1])
    
    # Demand volume model
    demand = rolling_avg
    if is_festival:
        demand *= 1.3
    if weather_rain:
        demand *= 0.9 if prod in ['Tomato', 'Banana'] else 1.05 # Potato demand up in rains
    if weather_heat:
        demand *= 0.85 if prod in ['Tomato', 'Cabbage'] else 1.0
        
    # Price elasticity
    avg_price = sum(spec['price_range']) / 2
    price_ratio = price_level / avg_price
    demand *= (1.2 - (price_ratio * 0.2)) # Higher price -> lower demand
    
    demand = max(5.0, demand + np.random.normal(0, rolling_avg * 0.1))
    
    m4_rows.append({
        'produce': prod,
        'buyer_type': buyer_type,
        'rolling_avg': rolling_avg,
        'month': month,
        'is_festival': is_festival,
        'weather_rain': weather_rain,
        'weather_heat': weather_heat,
        'price_level': price_level,
        'demand': demand
    })

df_m4 = pd.DataFrame(m4_rows)
df_m4['produce_enc'] = df_m4['produce'].map(prod_mapping)

X_m4 = df_m4[['produce_enc', 'buyer_type', 'rolling_avg', 'month', 'is_festival', 'weather_rain', 'weather_heat', 'price_level']]
y_demand = df_m4['demand']

dt_demand = DecisionTreeRegressor(max_depth=6, random_state=42)
dt_demand.fit(X_m4, y_demand)

# Function to serialize Decision Tree to JSON
def serialize_tree(tree, feature_names):
    left = tree.children_left
    right = tree.children_right
    threshold = tree.threshold
    features = tree.feature
    values = tree.value

    def recurse(node):
        if left[node] == right[node]: # Leaf node
            return float(values[node][0][0])
        else:
            return {
                'feature': feature_names[features[node]],
                'threshold': float(threshold[node]),
                'left': recurse(left[node]),
                'right': recurse(right[node])
            }
            
    return recurse(0)

# Export models to JSON
print("Step 4: Exporting Models to JSON...")
m3_feature_names = ['produce_enc', 'temp', 'hum', 'days_since_harvest']
m4_feature_names = ['produce_enc', 'buyer_type', 'rolling_avg', 'month', 'is_festival', 'weather_rain', 'weather_heat', 'price_level']

shelf_life_model = {
    'produce_mapping': prod_mapping,
    'risk_tree': serialize_tree(dt_risk.tree_, m3_feature_names),
    'rem_days_tree': serialize_tree(dt_rem.tree_, m3_feature_names)
}

demand_model = {
    'produce_mapping': prod_mapping,
    'demand_tree': serialize_tree(dt_demand.tree_, m4_feature_names)
}

with open('backend/src/models/shelf_life_model.json', 'w') as f:
    json.dump(shelf_life_model, f, indent=2)

with open('backend/src/models/demand_model.json', 'w') as f:
    json.dump(demand_model, f, indent=2)

# Save synthetic dataset metadata for evaluation display
df_m4.to_csv('data/synthetic/historical_orders.csv', index=False)

print("SUCCESS: ML Models trained and successfully exported to backend!")
