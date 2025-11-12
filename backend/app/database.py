from motor.motor_asyncio import AsyncIOMotorClient
import os
from dotenv import load_dotenv
from urllib.parse import quote_plus, urlparse, urlunparse

load_dotenv()

MONGODB_URI_RAW = os.getenv("MONGODB_URI", "mongodb://localhost:27017")
DATABASE_NAME = os.getenv("DATABASE_NAME", "deeprealties")

def encode_mongodb_uri(uri: str) -> str:
    """Encode username and password in MongoDB URI according to RFC 3986."""
    try:
        # Handle mongodb+srv:// URIs
        if uri.startswith("mongodb+srv://"):
            protocol = "mongodb+srv://"
            rest = uri[len(protocol):]
            
            # Check if URI has credentials
            if "@" not in rest:
                return uri  # No credentials to encode
            
            # Split credentials and host/path
            if "/" in rest:
                credentials_host, path = rest.split("/", 1)
                path = "/" + path
            else:
                credentials_host = rest
                path = ""
            
            if "@" in credentials_host:
                credentials, host = credentials_host.split("@", 1)
                if ":" in credentials:
                    username, password = credentials.split(":", 1)
                    encoded_username = quote_plus(username)
                    encoded_password = quote_plus(password)
                    return f"{protocol}{encoded_username}:{encoded_password}@{host}{path}"
                else:
                    # Only username, no password
                    encoded_username = quote_plus(credentials)
                    return f"{protocol}{encoded_username}@{host}{path}"
        
        # Handle standard mongodb:// URIs
        elif uri.startswith("mongodb://"):
            parsed = urlparse(uri)
            
            # If no username/password, return as-is
            if not parsed.username and not parsed.password:
                return uri
            
            # Encode username and password
            encoded_username = quote_plus(parsed.username) if parsed.username else ""
            encoded_password = quote_plus(parsed.password) if parsed.password else ""
            
            # Reconstruct netloc with encoded credentials
            if encoded_password:
                auth_part = f"{encoded_username}:{encoded_password}@"
            elif encoded_username:
                auth_part = f"{encoded_username}@"
            else:
                auth_part = ""
            
            # Add host and port
            host_part = parsed.hostname or ""
            if parsed.port:
                host_part = f"{host_part}:{parsed.port}"
            
            netloc = f"{auth_part}{host_part}"
            
            # Reconstruct the full URI
            encoded_uri = urlunparse((
                parsed.scheme,
                netloc,
                parsed.path,
                parsed.params,
                parsed.query,
                parsed.fragment
            ))
            return encoded_uri
        
        return uri
    except Exception as e:
        # If parsing fails, return original URI
        print(f"Warning: Could not encode MongoDB URI: {e}")
        return uri

MONGODB_URI = encode_mongodb_uri(MONGODB_URI_RAW)

# For async operations
client = None
database = None

async def connect_to_mongo():
    global client, database
    try:
        client = AsyncIOMotorClient(MONGODB_URI)
        database = client[DATABASE_NAME]
        # Test the connection
        await client.admin.command('ping')
        print("Connected to MongoDB successfully")
    except Exception as e:
        print(f"Error connecting to MongoDB: {e}")
        raise

async def close_mongo_connection():
    global client
    if client:
        client.close()
        print("Disconnected from MongoDB")

def get_database():
    return database

