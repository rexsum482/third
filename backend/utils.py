import boto3
from django.conf import settings

def send_otp_sms(phone_number, otp_code):
    client = boto3.client(
        'sns',
        aws_access_key_id=settings.AWS_ACCESS_KEY_ID,
        aws_secret_access_key=settings.AWS_SECRET_ACCESS_KEY,
        region_name=settings.AWS_REGION_NAME,
    )

    message = f"Your verification code is {otp_code}"

    client.publish(
        PhoneNumber=phone_number,  # E.164 format e.g., +15551234567
        Message=message
    )

def trim_and_case(input_str):
    result = []
    for char in input_str:
        if char != ' ':
            result.append(char.lower())
    return ''.join(result)
