from .utils import load_translations, t

def inject_translations(request):
    lang = request.session.get('lang', 'en')
    translations = load_translations()
    return {
        't': lambda key, fallback=None: t(key, lang, translations, fallback),
        'lang': lang
    }