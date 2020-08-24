from common.rpc.utils import create_service, requires_master_secret

service = create_service(__name__)


@requires_master_secret
@service.route("/api/trigger_build")
def trigger_build_sync(*, pr_number: int):
    ...


@requires_master_secret
@service.route("/api/deploy_prod_app_sync")
def deploy_prod_app_sync(*, target_app: str):
    ...
