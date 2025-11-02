from fabric import task

from config.utils.role_based import build_group_list
from billing.utils.product import add_mentorship_products_to_db

# --------------------------------
# Importing test functions
from config.utils.test import test_config_utils
from core.utils.test import test_core_utils
from ai.utils.test import test_ai_manager
from billing.utils.test import test_billing_utils
# --------------------------------

@task
def buildgrouplist(ctx):
    build_group_list()

@task
def addmentorshipproducts(ctx):
    add_mentorship_products_to_db()

# --------------------------------------------
# Testing Tasks Beginning
# --------------------------------------------
@task
def testconfigutils(ctx):
    test_config_utils()

@task
def testaimanager(ctx):
    test_ai_manager()

@task
def testcoreutils(ctx):
    test_core_utils()

@task
def testbillingutils(ctx):
    test_billing_utils()
# --------------------------------------------
# Testing Tasks Ending
# --------------------------------------------