import requests

def lookup_plate(plate, state='TX'):
    url = 'https://apibroker-license-plate-search-v1.p.rapidapi.com/license-plate-search'
    headers = {
        'x-rapidapi-host': 'apibroker-license-plate-search-v1.p.rapidapi.com',
        'x-rapidapi-key': 'f57c53beefmshab03eb50e8f55d5p16e8c4jsn23583a1c7329'
    }
    params = {
        'format': 'json',
        'plate': plate,
        'state': state,
    }

    res = requests.get(url, headers=headers, params=params)

    try:
        res.raise_for_status()
        data_json = res.json()
        content = data_json.get('content', {})
        return content
    except requests.exceptions.RequestException as e:
        print(f"API error: {e}")
        return None
    except Exception as e:
        print(f"Unexpected error: {e}")
        return None
