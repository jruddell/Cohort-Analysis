import os

class Config(object):
    _env_id = 'default'
    """Normalize settings for use within the application code."""

    DEBUG = False

    # APPLICATION
    SECRET_KEY = '' #some random set of characters
    SESSION_TYPE = '' #could be filesystem, redis... etc.
    ADMINS = '' #admin email address
    AUTH_TOKEN_EXPIRATION = 52 * 7 * 24 * 60 * 60  # seconds (1 year)
    GENERATED_DEFAULT_PASSWORD = 'put your defaul password here'
    MAX_INVALID_LOGIN_ATTEMPTS = 10 
    INVALID_LOGIN_ATTEMPTS_RESET_WINDOW_MINUTES = 30


class ProductionConfig(Config):
    _env_id = 'production'
    SESSION_TYPE = '' #production should be filesystem


class LocalConfig(Config):
    _env_id = 'local'
    DEBUG = True
    API_URI = '' #location of your web server e.g. localhost://8080
    AUTH_APP_TOKEN = '' #a long string of characters for authentication on your requests


class CurrentConfig(object):
    _config_map = {c._env_id: c for c in Config.__subclasses__()}

    _value = None
    _env = None

    @property
    def env(self):
        if self._env is None:
            self._env = os.environ.get('ENVIRONMENT', 'local')

        return self._env

    @property
    def value(self):
        if self._value is None:
            self._value = self._config_map.get(self.env, None)

            if self._value is None:
                raise ValueError('Unexpected ENVIRONMENT value -> {env}'.format(env=self.env))

        return self._value


# alias so config can be accessed through from src.common import config ... config.current
current = CurrentConfig()


# handles flask app specific configuration
# also sets current config object for application use
def init(app, val=None):
    # optionally init with a particular environment
    if val is not None:
        current._env = val

    # applies the configuration object to the web server
    app.config.from_object(current.value.__module__ + '.' + current.value.__name__)
    return current.value