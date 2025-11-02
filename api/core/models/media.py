from django.db import models

from core.models.base_model import TimeStampedModel, MediaFileS3Storage
from core.utils.helpers import get_media_upload_path

FILE_TYPES = [
    ('IMAGE', 'IMAGE'),
    ('VIDEO', 'VIDEO'),
    ('PDF', 'PDF'),
    ('CSV', 'CSV'),
    ('AUDIO', 'AUDIO'),
    ('OTHER', 'OTHER')
]

POST_TYPES = [
    ('BLOG', 'BLOG'),
    ('TIP', 'TIP'),
    ('PROJECT', 'PROJECT'),
    ('COURSE', 'COURSE'),
    ('TESTIMONIAL', 'TESTIMONIAL'),
    ('GENERAL', 'GENERAL')
]

class Media(TimeStampedModel):
    title = models.CharField(max_length=248, unique=True)
    file = models.FileField(storage=MediaFileS3Storage(is_public=True, bucket_name="media"), upload_to=get_media_upload_path, blank=True, null=True)
    file_type = models.CharField(
        max_length=256, choices=FILE_TYPES)
    post_type = models.CharField(
        max_length=256, choices=POST_TYPES)