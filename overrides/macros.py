from datetime import datetime
import os


def define_env(env):
    env.variables['build_timestamp'] = datetime.utcnow().isoformat() + 'Z'
    env.variables['git_sha'] = os.getenv('GITHUB_SHA', '')[:7]
    env.variables['build_number'] = os.getenv('GITHUB_RUN_NUMBER', '')
