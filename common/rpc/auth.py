from functools import wraps

from common.rpc.secrets import get_secret
from common.rpc.utils import cached, create_service

service = create_service(__name__)


def auth_endpoint(func):
    @wraps(func)
    def wrapped(**kwargs):
        secret = get_secret(secret_name="AUTH_SECRET")
        return func(**kwargs, secret=secret)

    return wrapped


@cached()
@auth_endpoint
@service.route("/admins/is_admin")
def is_admin(*, course: str, email: str):
    ...


@cached()
@auth_endpoint
@service.route("/admins/list_admins")
def list_admins(*, course: str):
    ...


@cached()
@service.route("/domains/get_course")
def get_course(*, domain: str):
    ...


@auth_endpoint
@service.route("/google/read_document")
def read_document(*, course: str, url: str, doc_id: str):
    ...


@auth_endpoint
@service.route("/google/read_spreadsheet")
def read_spreadsheet(*, course: str, url: str, doc_id: str, sheet_name: str):
    ...


@auth_endpoint
@service.route("/google/write_spreadsheet")
def write_spreadsheet(
    *, course: str, url: str, doc_id: str, sheet_name: str, content: str
):
    ...


@cached()
@service.route("/api/list_courses")
def list_courses():
    ...


@cached()
@service.route("/api/get_endpoint")
def get_endpoint(*, course: str):
    ...


@cached()
@service.route("/api/get_endpoint_id")
def get_endpoint_id(*, course: str):
    ...


@cached()
@auth_endpoint
@service.route("/piazza/perform_action")
def perform_piazza_action(
    *, action: str, course: str, as_staff: bool, is_test: bool, kwargs: dict
):
    ...


@cached()
@auth_endpoint
@service.route("/piazza/course_id")
def piazza_course_id(*, course: str, is_test: bool, test: bool):
    ...


@cached()
@auth_endpoint
@service.route("/slack/workspace_name")
def slack_workspace_name(*, course: str):
    ...


@cached()
@auth_endpoint
@service.route("/slack/post_message")
def post_slack_message(*, course: str, message: str, purpose: str):
    ...
