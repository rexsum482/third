from django.db import models

class Review(models.Model):
    class Stars(models.IntegerChoices):
        ONE = 1, '⭐'
        TWO = 2, '⭐⭐'
        THREE = 3, '⭐⭐⭐'
        FOUR = 4, '⭐⭐⭐⭐'
        FIVE = 5, '⭐⭐⭐⭐⭐'

    name = models.CharField(max_length=32)
    rating = models.IntegerField(choices=Stars.choices)
    review = models.TextField()

    def __str__(self):
        return f"{self.name} - {self.get_rating_display()}"