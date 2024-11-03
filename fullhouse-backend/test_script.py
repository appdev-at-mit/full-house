from accounts.serializers import TinySerializer

b = TinySerializer(data={"value": 4})

print(b)
print(b.is_valid())
b.save()
print("saved")
