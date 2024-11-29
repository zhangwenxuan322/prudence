from typing import Any
from django import forms
from django.contrib.auth.forms import UserCreationForm
from .models import CustomUser  # Import the custom user model


class CustomUserCreationForm(UserCreationForm):
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        super().__init__(*args, **kwargs)
        self.fields['username'].widget.attrs.update({
            'required': '',
            'name': 'username',
            'id': 'username',
            'type': 'text',
            'class': 'form-input',
            'placeholder': 'Enter your username',
        })

        self.fields['first_name'].widget.attrs.update({
            'required': '',
            'name': 'first_name',
            'id': 'first_name',
            'type': 'text',
            'class': 'form-input',
            'placeholder': 'Enter your first name',
        })

        self.fields['last_name'].widget.attrs.update({
            'required': '',
            'name': 'last_name',
            'id': 'last_name',
            'type': 'text',
            'class': 'form-input',
            'placeholder': 'Enter your last name',
        })

        self.fields['email'].widget.attrs.update({
            'required': '',
            'name': 'email',
            'id': 'email',
            'type': 'text',
            'class': 'form-input',
            'placeholder': 'Enter a valid email address.',
        })

        self.fields['password1'].widget.attrs.update({
            'required': '',
            'name': 'password1',
            'id': 'password1',
            'type': 'password',
            'class': 'form-input',
            'placeholder': 'Minimum 3 characters',
        })

        self.fields['password2'].widget.attrs.update({
            'required': '',
            'name': 'password2',
            'id': 'password2',
            'type': 'password',
            'class': 'form-input',
            'placeholder': 'Confirm password',
        })

    class Meta:
        model = CustomUser  # Reference the correct model
        fields = ('username', 'first_name', 'last_name',
                  'email', 'role', 'password1', 'password2')

    def save(self, commit=True):
        user = super().save(commit=False)
        user.email = self.cleaned_data["email"]
        if commit:
            user.save()
        return user
