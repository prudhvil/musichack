from bs4 import BeautifulSoup
import requests
import re
import logging
import itunes

YOUTUBE_URL = 'https://www.youtube.com/results?search_query=%s'

video_cache = {}

if not itunes.is_caching_enabled():
    itunes.enable_caching('/tmp/itunes_cache') #If no param given it creates a folder in /tmp
logging.info("Caching artwork in %s", itunes.__cache_dir)

def get_artwork(song):
    song_name = re.sub(r'\([^)]*\)', '', song[1]).strip().lower()
    artist = song[0].lower()
    results = itunes.search("%s %s" % (song_name, artist), limit=1)
    if not results:
        return {}
    return results[0].artwork

def get_video(song):
    if song in video_cache:
        return video_cache[song]
    song_html = requests.get(YOUTUBE_URL % ("%s %s" % (song[0].lower(), song[1].lower()))).text
    soup = BeautifulSoup(song_html, 'html.parser')
    href = soup.find_all('ol', {'class': 'section-list'})[0].find('a').attrs['href']
    vid_id = href.split('=')[1]
    return vid_id
