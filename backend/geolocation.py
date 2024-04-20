import httpx
from dotenv import load_dotenv
import asyncio
import os

load_dotenv()
BASE_URL = "https://api.opencagedata.com/geocode/v1/json"
api_key = os.getenv("GEO_LOCATION_API")

async def get_city_name(latitude: float, longitude: float) -> str:
    try:
        api_key = os.environ["GEO_LOCATION_API"] 
    except KeyError:
        return "API key not found"
    try:
        latitude = float(latitude)
        longitude = float(longitude)
    except ValueError:
        return "Invalid latitude or longitude"    
    params = {
        "q": f"{latitude},{longitude}",
        "key": api_key,
        "limit": 1,
    }
       
    async with httpx.AsyncClient() as client:
        try:
            response = await client.get(BASE_URL, params=params)
            data = response.json()
        
            if response.status_code != 200:
                return "Could not retrieve the city name"
            
            components = data['results'][0]['components']
            city = components.get('city', components.get('town', components.get('village')))
            return city if city else "City name not found"
        except (KeyError, IndexError):
            return "City name not found"

# def main():
#     city = asyncio.run(get_city_name(37.7749, -122.4194))
#     print(city)

# if __name__ == "__main__":
#     main()
