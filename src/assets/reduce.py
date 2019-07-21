import json,Akkkkkkkk
airports = []

with open('airports.json', 'r') as f:
    content = f.read()
    data = json.loads(content)
    for k,v in data.items():
        code = v['iata']
        if code:
            airport = {
                "code": code,
                "name": v['name'],
                "city": v['city'],
                "state": v['state'],
                "country": v['country']
            }
            airports.append(airport)


with open('airports.js', 'w') as f:
    f.write(str(airports))

