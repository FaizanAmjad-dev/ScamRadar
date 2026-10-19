from rest_framework.permissions import BasePermission,SAFE_METHODS

# Super user hi sub kuch kar sakta hai 
class IsAdmin (BasePermission):
    def has_permission(self, request, view):
        return bool(request.user and request.user.is_authenticated and (request.user.is_superuser or request.user.is_staff))



class OwnerOrAdmin(BasePermission):
    def has_permission(self,request,view):
        # read_only :har koi isy read kar saktha hai 
        if request.method in SAFE_METHODS:
            return True
        # ya authentication check karny ka leay hai 
        return bool(request.user and request.user.is_authenticated)
    
    def has_object_permission(self, request, view, obj):
        # read_only :har koi isy read kar saktha hai 
        if request.method in SAFE_METHODS:
            return True
                
        # super user ko hi sary access hai 
        if request.user.is_superuser or request.user.is_staff:
            return True

        # create /delete or update ka leay use login hona zaruri 
        if not (request.user.is_authenticated and request.user):
            return False
        
        # agar user kudh ho to 
        if obj == request.user:
            return True
        
        # comment /chat /group chat :ma cheak karny ka leya ka user kudh ki comment post chat ko delete or edit update ka saky 
        if hasattr(obj,'user') and obj.user == request.user :
            return obj.user == request.user
        return False

# ya private chat or dashbord ka leya hai 
class PrivateOwnerOrAdmin(BasePermission):
    def has_permission(self, request, view):
        return bool( request.user and request.user.is_authenticated
        )

    def has_object_permission(self, request, view, obj):
        user = request.user

        if user.is_superuser:
            return True

        if obj.user == user:
            return True

        return False


# deakh sub sakty hia lakin admin hi CRUD kar sakta hia 
class IsSuperUserOrReadOnly(BasePermission):
    def has_permission(self, request, view):
        if request.method in SAFE_METHODS:
            return True
        user = request.user
        return bool ( user and user.is_authenticated and user.is_superuser
                     )