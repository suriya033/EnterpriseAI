import requests

with open('test.txt', 'w') as f:
    f.write('Hello World')

res = requests.post('http://localhost:8000/api/documents/upload', files={'file': open('test.txt', 'rb')})
print(res.status_code, res.text)
