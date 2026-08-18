# products/seed_data/category_attributes.py

DATA = {
    "electronics": {
        "attributes": [
            {"name":"Brand","attribute_type":"text","required":True},
            {"name":"Model","attribute_type":"text","required":True},
            {"name":"Color","attribute_type":"color","required":False},
            {"name":"Storage","attribute_type":"select","options":["32 GB","64 GB","128 GB","256 GB","512 GB","1 TB"]},
            {"name":"Warranty","attribute_type":"number","unit":"month"},
        ]
    },

    "clothing": {
        "attributes":[
            {"name":"Brand","attribute_type":"text"},
            {"name":"Size","attribute_type":"select","required":True,
             "options":["XS","S","M","L","XL","XXL"]},
            {"name":"Color","attribute_type":"color"},
            {"name":"Material","attribute_type":"text"},
            {"name":"Gender","attribute_type":"select",
             "options":["Men","Women","Unisex","Kids"]},
        ]
    },

    "cosmetics":{
        "attributes":[
            {"name":"Brand","attribute_type":"text","required":True},
            {"name":"Skin Type","attribute_type":"select",
             "options":["Dry","Normal","Oily","Combination","Sensitive"]},
            {"name":"Volume","attribute_type":"text"},
            {"name":"Expiry Date","attribute_type":"text"},
        ]
    },

    "digital_products":{
        "attributes":[
            {"name":"Platform","attribute_type":"select",
             "options":["Windows","Android","iOS","Mac","Linux","Web"]},
            {"name":"License Type","attribute_type":"select",
             "options":["Lifetime","Monthly","Yearly"]},
        ]
    },

    "accessories_perfume":{
        "attributes":[
            {"name":"Brand","attribute_type":"text"},
            {"name":"Color","attribute_type":"color"},
            {"name":"Volume","attribute_type":"text"},
        ]
    },

    "cars_chargers":{
        "attributes":[
            {"name":"Compatible Brand","attribute_type":"text"},
            {"name":"Voltage","attribute_type":"text"},
        ]
    },

    "food_drinks":{
        "attributes":[
            {"name":"Weight","attribute_type":"text"},
            {"name":"Expiry Date","attribute_type":"text"},
            {"name":"Halal","attribute_type":"boolean"},
        ]
    },

    "furniture":{
        "attributes":[
            {"name":"Material","attribute_type":"text"},
            {"name":"Color","attribute_type":"color"},
            {"name":"Width","attribute_type":"number","unit":"cm"},
            {"name":"Height","attribute_type":"number","unit":"cm"},
            {"name":"Depth","attribute_type":"number","unit":"cm"},
        ]
    },

    "home_supplies":{
        "attributes":[
            {"name":"Material","attribute_type":"text"},
            {"name":"Color","attribute_type":"color"},
        ]
    },

    "books_education":{
        "attributes":[
            {"name":"Author","attribute_type":"text"},
            {"name":"Language","attribute_type":"text"},
            {"name":"Pages","attribute_type":"number"},
        ]
    },

    "baby_supplies":{
        "attributes":[
            {"name":"Age","attribute_type":"text"},
            {"name":"Brand","attribute_type":"text"},
        ]
    },

    "machine_parts":{
        "attributes":[
            {"name":"Part Number","attribute_type":"text"},
            {"name":"Compatible Model","attribute_type":"text"},
        ]
    },

    "medical_devices":{
        "attributes":[
            {"name":"Brand","attribute_type":"text"},
            {"name":"Model","attribute_type":"text"},
            {"name":"CE Certified","attribute_type":"boolean"},
        ]
    },

    "plants_agriculture":{
        "attributes":[
            {"name":"Plant Type","attribute_type":"text"},
            {"name":"Sunlight","attribute_type":"select",
             "options":["Full Sun","Partial Shade","Shade"]},
        ]
    },

    "sports_equipment":{
        "attributes":[
            {"name":"Brand","attribute_type":"text"},
            {"name":"Size","attribute_type":"text"},
            {"name":"Color","attribute_type":"color"},
        ]
    },

    "toys_hobbies":{
        "attributes":[
            {"name":"Age Group","attribute_type":"text"},
            {"name":"Material","attribute_type":"text"},
        ]
    },

    "other":{
        "attributes":[
            {"name":"Brand","attribute_type":"text"},
            {"name":"Color","attribute_type":"color"},
        ]
    }
}