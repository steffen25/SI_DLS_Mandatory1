from locust import HttpLocust, TaskSet

def login(l):
    l.client.post("/login", {"email":"anemail@kea.dk", "password":"123456"})

def get_all_users(l):
    l.client.get("/users")

def get_schedules_by_week_number(l):
    headers = {'Authorization': 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwiX2lkIjoiNWExN2U5ODgzYmY4Y2VmMjhmYmZhZmZkIiwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsiaXNBZG1pbiI6ImluaXQiLCJjcmVhdGVkQXQiOiJpbml0IiwiX192IjoiaW5pdCIsInRlYW1JZCI6ImluaXQiLCJwaG9uZSI6ImluaXQiLCJhZGRyZXNzIjoiaW5pdCIsImxhc3ROYW1lIjoiaW5pdCIsImZpcnN0TmFtZSI6ImluaXQiLCJlbWFpbCI6ImluaXQiLCJwYXNzd29yZCI6Im1vZGlmeSIsIl9pZCI6ImluaXQifSwic3RhdGVzIjp7Imlnbm9yZSI6e30sImRlZmF1bHQiOnt9LCJpbml0Ijp7Il9fdiI6dHJ1ZSwiaXNBZG1pbiI6dHJ1ZSwiY3JlYXRlZEF0Ijp0cnVlLCJ0ZWFtSWQiOnRydWUsInBob25lIjp0cnVlLCJhZGRyZXNzIjp0cnVlLCJsYXN0TmFtZSI6dHJ1ZSwiZmlyc3ROYW1lIjp0cnVlLCJlbWFpbCI6dHJ1ZSwiX2lkIjp0cnVlfSwibW9kaWZ5Ijp7InBhc3N3b3JkIjp0cnVlfSwicmVxdWlyZSI6e319LCJzdGF0ZU5hbWVzIjpbInJlcXVpcmUiLCJtb2RpZnkiLCJpbml0IiwiZGVmYXVsdCIsImlnbm9yZSJdfSwicGF0aHNUb1Njb3BlcyI6e30sImVtaXR0ZXIiOnsiZG9tYWluIjpudWxsLCJfZXZlbnRzIjp7fSwiX2V2ZW50c0NvdW50IjowLCJfbWF4TGlzdGVuZXJzIjowfSwiJG9wdGlvbnMiOnRydWV9LCJpc05ldyI6ZmFsc2UsIl9kb2MiOnsiaXNBZG1pbiI6dHJ1ZSwiY3JlYXRlZEF0IjoiMjAxNy0xMS0yNFQwOTo0MjozMi4zMDNaIiwiX192IjowLCJ0ZWFtSWQiOiI1YTBkNjg4N2IxYmMyNTAwMTRiMzZjMzMiLCJwaG9uZSI6IjEyMzQ1Njc4IiwiYWRkcmVzcyI6IlN0cmVldCAyIiwibGFzdE5hbWUiOiJKb2huc29uIiwiZmlyc3ROYW1lIjoiQWxsYW4iLCJlbWFpbCI6ImFsaUBrZWEuZGsiLCJfaWQiOiI1YTE3ZTk4ODNiZjhjZWYyOGZiZmFmZmQifSwiJGluaXQiOnRydWUsImlhdCI6MTUxMTUxNzAwMX0.-3X01M06rfb2fSrcjBVj7zbTO2w3j4mrnDBSqIK0yfI'}
    l.client.get("/schedules/week/47", headers=headers)

def get_schedules_by_week_number_and_week_day(l):
    headers = {'Authorization': 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwiX2lkIjoiNWExN2U5ODgzYmY4Y2VmMjhmYmZhZmZkIiwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsiaXNBZG1pbiI6ImluaXQiLCJjcmVhdGVkQXQiOiJpbml0IiwiX192IjoiaW5pdCIsInRlYW1JZCI6ImluaXQiLCJwaG9uZSI6ImluaXQiLCJhZGRyZXNzIjoiaW5pdCIsImxhc3ROYW1lIjoiaW5pdCIsImZpcnN0TmFtZSI6ImluaXQiLCJlbWFpbCI6ImluaXQiLCJwYXNzd29yZCI6Im1vZGlmeSIsIl9pZCI6ImluaXQifSwic3RhdGVzIjp7Imlnbm9yZSI6e30sImRlZmF1bHQiOnt9LCJpbml0Ijp7Il9fdiI6dHJ1ZSwiaXNBZG1pbiI6dHJ1ZSwiY3JlYXRlZEF0Ijp0cnVlLCJ0ZWFtSWQiOnRydWUsInBob25lIjp0cnVlLCJhZGRyZXNzIjp0cnVlLCJsYXN0TmFtZSI6dHJ1ZSwiZmlyc3ROYW1lIjp0cnVlLCJlbWFpbCI6dHJ1ZSwiX2lkIjp0cnVlfSwibW9kaWZ5Ijp7InBhc3N3b3JkIjp0cnVlfSwicmVxdWlyZSI6e319LCJzdGF0ZU5hbWVzIjpbInJlcXVpcmUiLCJtb2RpZnkiLCJpbml0IiwiZGVmYXVsdCIsImlnbm9yZSJdfSwicGF0aHNUb1Njb3BlcyI6e30sImVtaXR0ZXIiOnsiZG9tYWluIjpudWxsLCJfZXZlbnRzIjp7fSwiX2V2ZW50c0NvdW50IjowLCJfbWF4TGlzdGVuZXJzIjowfSwiJG9wdGlvbnMiOnRydWV9LCJpc05ldyI6ZmFsc2UsIl9kb2MiOnsiaXNBZG1pbiI6dHJ1ZSwiY3JlYXRlZEF0IjoiMjAxNy0xMS0yNFQwOTo0MjozMi4zMDNaIiwiX192IjowLCJ0ZWFtSWQiOiI1YTBkNjg4N2IxYmMyNTAwMTRiMzZjMzMiLCJwaG9uZSI6IjEyMzQ1Njc4IiwiYWRkcmVzcyI6IlN0cmVldCAyIiwibGFzdE5hbWUiOiJKb2huc29uIiwiZmlyc3ROYW1lIjoiQWxsYW4iLCJlbWFpbCI6ImFsaUBrZWEuZGsiLCJfaWQiOiI1YTE3ZTk4ODNiZjhjZWYyOGZiZmFmZmQifSwiJGluaXQiOnRydWUsImlhdCI6MTUxMTUxNzAwMX0.-3X01M06rfb2fSrcjBVj7zbTO2w3j4mrnDBSqIK0yfI'}
    l.client.get("/schedules/week/47/day/1", headers=headers)

def get_schedules_by_week_number_and_week_day_with_cancellation(l):
    headers = {'Authorization': 'JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyIkX18iOnsic3RyaWN0TW9kZSI6dHJ1ZSwic2VsZWN0ZWQiOnt9LCJnZXR0ZXJzIjp7fSwiX2lkIjoiNWExN2U5ODgzYmY4Y2VmMjhmYmZhZmZkIiwid2FzUG9wdWxhdGVkIjpmYWxzZSwiYWN0aXZlUGF0aHMiOnsicGF0aHMiOnsiaXNBZG1pbiI6ImluaXQiLCJjcmVhdGVkQXQiOiJpbml0IiwiX192IjoiaW5pdCIsInRlYW1JZCI6ImluaXQiLCJwaG9uZSI6ImluaXQiLCJhZGRyZXNzIjoiaW5pdCIsImxhc3ROYW1lIjoiaW5pdCIsImZpcnN0TmFtZSI6ImluaXQiLCJlbWFpbCI6ImluaXQiLCJwYXNzd29yZCI6Im1vZGlmeSIsIl9pZCI6ImluaXQifSwic3RhdGVzIjp7Imlnbm9yZSI6e30sImRlZmF1bHQiOnt9LCJpbml0Ijp7Il9fdiI6dHJ1ZSwiaXNBZG1pbiI6dHJ1ZSwiY3JlYXRlZEF0Ijp0cnVlLCJ0ZWFtSWQiOnRydWUsInBob25lIjp0cnVlLCJhZGRyZXNzIjp0cnVlLCJsYXN0TmFtZSI6dHJ1ZSwiZmlyc3ROYW1lIjp0cnVlLCJlbWFpbCI6dHJ1ZSwiX2lkIjp0cnVlfSwibW9kaWZ5Ijp7InBhc3N3b3JkIjp0cnVlfSwicmVxdWlyZSI6e319LCJzdGF0ZU5hbWVzIjpbInJlcXVpcmUiLCJtb2RpZnkiLCJpbml0IiwiZGVmYXVsdCIsImlnbm9yZSJdfSwicGF0aHNUb1Njb3BlcyI6e30sImVtaXR0ZXIiOnsiZG9tYWluIjpudWxsLCJfZXZlbnRzIjp7fSwiX2V2ZW50c0NvdW50IjowLCJfbWF4TGlzdGVuZXJzIjowfSwiJG9wdGlvbnMiOnRydWV9LCJpc05ldyI6ZmFsc2UsIl9kb2MiOnsiaXNBZG1pbiI6dHJ1ZSwiY3JlYXRlZEF0IjoiMjAxNy0xMS0yNFQwOTo0MjozMi4zMDNaIiwiX192IjowLCJ0ZWFtSWQiOiI1YTBkNjg4N2IxYmMyNTAwMTRiMzZjMzMiLCJwaG9uZSI6IjEyMzQ1Njc4IiwiYWRkcmVzcyI6IlN0cmVldCAyIiwibGFzdE5hbWUiOiJKb2huc29uIiwiZmlyc3ROYW1lIjoiQWxsYW4iLCJlbWFpbCI6ImFsaUBrZWEuZGsiLCJfaWQiOiI1YTE3ZTk4ODNiZjhjZWYyOGZiZmFmZmQifSwiJGluaXQiOnRydWUsImlhdCI6MTUxMTUxNzAwMX0.-3X01M06rfb2fSrcjBVj7zbTO2w3j4mrnDBSqIK0yfI'}
    l.client.get("/schedules/week/47/day/4", headers=headers)

class UserBehavior(TaskSet):
    tasks = {login: 1, get_schedules_by_week_number: 3, get_schedules_by_week_number_and_week_day: 3, get_schedules_by_week_number_and_week_day_with_cancellation: 2}

class WebsiteUser(HttpLocust):
    task_set = UserBehavior
    min_wait = 5000
    max_wait = 9000