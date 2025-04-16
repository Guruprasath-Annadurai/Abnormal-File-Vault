
from django.http import JsonResponse

def index(request):
    return JsonResponse({
        'status': 'ok',
        'message': 'Welcome to File Vault API',
        'endpoints': {
            'files': '/api/files/',
            'admin': '/admin/'
        }
    })
