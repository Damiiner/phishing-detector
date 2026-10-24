import re
import numpy as np

MAX_LEN = 100

def normalize(url):
    u = str(url).strip().lower()
    u = re.sub(r"^[a-z]+://", "", u)
    u = re.sub(r"^www\.", "", u)
    u = u.rstrip("/")
    return u

def encode(urls):
    arr = np.zeros((len(urls), MAX_LEN), dtype="int32")
    for i, u in enumerate(urls):
        codes = [min(ord(c), 127) + 1 for c in u[:MAX_LEN]]
        arr[i, :len(codes)] = codes
    return arr
