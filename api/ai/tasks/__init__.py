from celery import shared_task

from ai.tasks.cost import apply_cost

@shared_task
def apply_cost_task(user_ids, cost, service):
    return apply_cost(user_ids, cost, service)