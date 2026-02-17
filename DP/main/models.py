from django.db import models

# Create your models here.

class Comment(models.Model):
    subject = models.CharField(max_length=200)
    content = models.TextField()
    user = models.CharField(max_length=100)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.subject

    class Meta:
        db_table = "comment"
        verbose_name = "comment"
        verbose_name_plural = "comments"
        ordering = ['-date']