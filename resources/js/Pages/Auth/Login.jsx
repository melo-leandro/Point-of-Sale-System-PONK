import { Head, useForm } from '@inertiajs/react';
import '../../../css/auth/login.css';
import ApplicationLogo from '@/Components/ApplicationLogo';

export default function Login({ status, errors: pageErrors }) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit = (e) => {
        e.preventDefault();
        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    return (
        <>
            <Head title="Login - Point of Sale System" />

            <div className="min-vh-100 d-flex justify-content-center align-items-center container">
                <div
                    className="login-card rounded border p-4 shadow"
                    style={{ maxWidth: 400, width: '100%' }}
                >
                    <div className="mb-4 text-center">
                        <ApplicationLogo className="iconPequeno"></ApplicationLogo>
                        <h1>PONK</h1>
                        <p>Point of Sale System</p>
                    </div>

                    {pageErrors && typeof pageErrors === 'string' && (
                        <div className="alert alert-danger" role="alert">
                            {pageErrors}
                        </div>
                    )}

                    {status && (
                        <div className="alert alert-success" role="alert">
                            {status}
                        </div>
                    )}

                    <form onSubmit={submit}>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label">
                                Email
                            </label>
                            <input
                                type="email"
                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                id="email"
                                name="email"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                required
                                autoFocus
                            />
                            {errors.email && (
                                <div className="invalid-feedback">
                                    {errors.email}
                                </div>
                            )}
                        </div>

                        <div className="mb-3">
                            <label htmlFor="password" className="form-label">
                                Senha
                            </label>
                            <input
                                type="password"
                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                id="password"
                                name="password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                required
                            />
                            {errors.password && (
                                <div className="invalid-feedback">
                                    {errors.password}
                                </div>
                            )}
                        </div>

                        <div className="form-check mb-3">
                            <input
                                type="checkbox"
                                className="form-check-input"
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onChange={(e) =>
                                    setData('remember', e.target.checked)
                                }
                            />
                            <label
                                className="form-check-label"
                                htmlFor="remember"
                            >
                                Lembrar-me
                            </label>
                        </div>

                        <button
                            type="submit"
                            className="btn btn-primary mt-2 px-5"
                            disabled={processing}
                        >
                            Entrar
                        </button>
                    </form>
                </div>
            </div>

            {/* Bootstrap JS (opcional se estiver usando já via layout base) */}
            <script
                src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"
                defer
            ></script>
        </>
    );
}
