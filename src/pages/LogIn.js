import { Component, tags, router, hooks, useState } from "@odoo/owl";
const { useDispatch } = hooks;
const Link = router.Link;
const { xml } = tags;
import { useApi } from "../hooks/useApi";

const LOG_IN_TEMPLATE = xml/* xml */ `
<div class="auth-page">
  <div class="container page">
    <div class="row">

      <div class="col-md-6 offset-md-3 col-xs-12">
        <h1 class="text-xs-center">Sign in</h1>
        <p class="text-xs-center">
            <Link to="'REGISTER'">Need an account?</Link>
        </p>

        <ul class="error-messages" t-if="state.logInError">
          <li>Invalid credentials</li>
        </ul>

        <form>
          <fieldset class="form-group">
            <input class="form-control form-control-lg" type="text" placeholder="Email" t-model="state.email"/>
          </fieldset>
          <fieldset class="form-group">
            <input class="form-control form-control-lg" type="password" placeholder="Password" t-model="state.password"/>
          </fieldset>
          <button class="btn btn-lg btn-primary pull-xs-right" t-on-click="login" t-att-disabled="state.loading">
            Sign In
          </button>
        </form>
      </div>

    </div>
  </div>
</div>
`;
export class LogIn extends Component {
  static components = { Link };
  static template = LOG_IN_TEMPLATE;
  dispatch = useDispatch();
  conduitApi = useApi();
  state = useState({
    email: "",
    password: "",
    logInError: false,
    loading: false,
  });

  async login(ev) {
    ev.preventDefault();
    if (this.state.loading) return;

    this.state.logInError = false;
    this.state.loading = true;
    let user = await this.conduitApi.login(
      this.state.email,
      this.state.password
    );
    if (user && user.token) {
      this.state.loading = false;
      this.dispatch("login", user);
      this.env.router.navigate({ to: "HOME" });
    } else {
      this.state.logInError = true;
    }
    this.state.loading = false;
  }
}
