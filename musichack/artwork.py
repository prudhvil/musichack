import re
import logging
import itunes

if not itunes.is_caching_enabled():
    itunes.enable_caching('/tmp/itunes_cache') #If no param given it creates a folder in /tmp
logging.info("Caching artwork in %s", itunes.__cache_dir)

def get_artwork(song):
    song_name = re.sub(r'\([^)]*\)', '', song[1]).strip().lower()
    artist = song[0].lower()
    print song_name, artist
    results = itunes.search("%s %s" % (song_name, artist), limit=1)
    if not results:
        return {}
    return results[0].artwork
