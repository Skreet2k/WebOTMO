using System;
using System.Collections.Generic;
using System.Linq;
using WebApi.Entities;

namespace WebApi.Services {
    public class FlowFunctions : IFunctionService {
        public List<double> ProcessFunction (long functionId, List<double> flow, int numFlow, double loadFactor) {
            double[] coeffs;
            List<double> list = new List<double> ();
            switch (functionId) {
                case 1:
                    list = flow;
                    break;
                case 2:
                    list = PacketsPerDt (flow, numFlow, loadFactor);
                    break;
                case 3:
                    list = mA (flow, numFlow);
                    break;
                case 4:
                    list = dA (flow, numFlow);
                    break;
                case 5:
                    list = Q (flow, numFlow, loadFactor);
                    break;
                case 6:
                    list = mQDependsLoadFactor (flow, numFlow);
                    break;
                case 7:
                    list = dQDependsLoadFactor (flow, numFlow);
                    break;
                case 8:
                    list = P (flow, numFlow, loadFactor);
                    break;
                case 9:
                    list = P0 (flow, numFlow, loadFactor);
                    break;
                case 10:
                    list = V (flow, numFlow, loadFactor);
                    break;
                case 11:
                    list = E (flow, numFlow, loadFactor);
                    break;
                case 12:
                    list = mE (flow, numFlow);
                    break;
                case 13:
                    list = F (flow, numFlow);
                    break;
                case 14:
                    coeffs = CoeffsAprox (flow);
                    list = Straight (coeffs[0], coeffs[1]);
                    break;
                case 15:
                    coeffs = CoeffsAprox (flow);
                    list = Parabola (coeffs[0], coeffs[1]);
                    break;
                case 16:
                    coeffs = CoeffsAprox (flow);
                    list = Aprox (coeffs[0], coeffs[1]);
                    break;
                case 17:
                    list = KI (flow, numFlow, loadFactor);
                    break;
                case 18:
                    list = PKI (flow, numFlow, loadFactor);
                    break;
                case 19:
                    list = Disp2 (flow, numFlow, loadFactor);
                    break;
                case 20:
                    list = Integral (flow, numFlow, loadFactor);
                    break;
            }
            return list;
        }

        private double TimeExperiment (List<double> flow) {
            return flow.Last () - flow.First ();
        }

        private List<double> PacketsInterval (List<double> flow) {
            var f = new List<double> {
                flow[0]
            };
            for (var i = 0; i < flow.Count - 1; i++)
                f.Add (flow[i + 1] - flow[i]);
            return f;
        }

        private double FlowRate (List<double> flow, int numFlow) {
            return flow.Count / (TimeExperiment (flow) * numFlow);
        }

        private double DeltaTime (List<double> flow, int numFlow, double loadFactor) {
            return loadFactor / FlowRate (flow, numFlow);
        }

        private List<double> PacketsPerDt (List<double> flow, int numFlow, double loadFactor) {
            var a = new List<double> ();
            for (var i = 0; i < Convert.ToInt32 (TimeExperiment (flow) / DeltaTime (flow, numFlow, loadFactor) - 1); i++)
                a.Add (0);
            var j = 0;
            for (var i = 1; i < a.Count; i++)
                while (flow[j] <= DeltaTime (flow, numFlow, loadFactor) * i) {
                    a[i - 1] += 1;
                    j++;
                }
            return a;
        }

        private List<double> Q (List<double> flow, int numFlow, double loadFactor) {
            var packetsPerDt = PacketsPerDt (flow, numFlow, loadFactor);
            var a = new List<double> { packetsPerDt[0] - 1 };

            for (var i = 1; i < packetsPerDt.Count; i++)
                if (a[i - 1] + packetsPerDt[i] - numFlow <= 0)
                    a.Add (0);
                else
                    a.Add (a[i - 1] + packetsPerDt[i] - numFlow);
            return a;
        }

        private List<double> V (List<double> flow, int numFlow, double loadFactor) {
            var packetsPerDt = PacketsPerDt (flow, numFlow, loadFactor);
            var q = Q (flow, numFlow, loadFactor);
            var a = new List<double> { q[1] };
            for (var i = 1; i < q.Count; i++)
                a.Add ((q[i] - q[i - 1]) / loadFactor / 10);
            return a;
        }

        private double MaxValue (List<double> flow) {
            return flow.Max ();
        }

        private double MathematicalExpectation (List<double> flow) {
            return flow.Sum () / flow.Count;
        }

        private double Dispersion (List<double> flow) {
            var m = MathematicalExpectation (flow);
            double disp = 0;
            for (var i = 0; i < flow.Count; i++)
                disp += (flow[i] - m) * (flow[i] - m);
            disp /= flow.Count;
            return disp;
        }

        private List<double> Disp2 (List<double> flow, int numFlow, double loadFactor) {
            var a = PacketsPerDt (flow, numFlow, loadFactor);
            var m = MathematicalExpectation (a);
            var disp = new List<double> ();
            for (var i = 0; i < a.Count; i++)
                disp.Add (0);
            for (var i = 0; i < a.Count; i++)
                for (var j = 0; j < a.Count - i; j++)
                    disp[i] += (a[j] - m) * (a[j + i] - m);
            return disp;
        }

        private List<double> Integral (List<double> flow, int numFlow, double loadFactor) {
            var disp = Disp2 (flow, numFlow, loadFactor);
            var integral = new List<double> ();
            double summ = 0;
            for (var i = 0; i < disp.Count; i++) {
                summ += i;
                integral.Add (summ);
            }
            return integral;
        }

        private List<double> KI (List<double> flow, int numFlow, double loadFactor) {
            var a = new List<double> { 0 };
            var q = Q (flow, numFlow, loadFactor);
            var packetsPerDt = PacketsPerDt (flow, numFlow, loadFactor);
            for (var i = 1; i < packetsPerDt.Count; i++)
                if (q[i - 1] + packetsPerDt[i] < numFlow)
                    a.Add (q[i - 1] + packetsPerDt[i]);
                else
                    a.Add (numFlow);
            return a;
        }

        private List<double> B (List<double> flow, int numFlow, double loadFactor) {
            var packetsPerDt = PacketsPerDt (flow, numFlow, loadFactor);
            var max = packetsPerDt.Max () + 1;
            var b = new List<double> ();
            for (var i = 0; i < max; i++) {
                b.Add (0);
                for (var j = 0; j < packetsPerDt.Count; j++)
                    if (j == i)
                        b[i]++;
            }
            return b;
        }

        private List<double> P (List<double> flow, int numFlow, double loadFactor) {
            var packetsPerDt = PacketsPerDt (flow, numFlow, loadFactor);
            var bb = B (flow, numFlow, loadFactor);
            return bb.Select (t => t / packetsPerDt.Count).ToList ();
        }

        private List<double> P0 (List<double> flow, int numFlow, double loadFactor) {
            var p0 = P (flow, numFlow, loadFactor);
            p0[0] = 0;
            return p0;
        }

        private List<double> mQDependsLoadFactor (List<double> flow, int numFlow) {
            var qq = new List<double> { 0 };
            for (var i = 0.1; i <= 1; i += 0.1)
                qq.Add (MathematicalExpectation (Q (flow, numFlow, i)));
            return qq;
        }

        private List<double> dA (List<double> flow, int numFlow) {
            var q = new List<double> { 0 };
            for (var i = 0.1; i <= 1; i += 0.1) {
                var qq = PacketsPerDt (flow, numFlow, i);
                for (var j = 0; j < qq.Count; j++)
                    qq[j] *= qq[j];
                q.Add (MathematicalExpectation (qq) - Math.Pow (MathematicalExpectation (PacketsPerDt (flow, numFlow, i)), 2));
            }
            return q;
        }

        private List<double> mA (List<double> flow, int numFlow) {
            var q = new List<double> ();
            q.Add (0);
            for (var i = 0.1; i <= 1; i += 0.1)
                q.Add (MathematicalExpectation (PacketsPerDt (flow, numFlow, i)));
            return q;
        }

        private List<double> dQDependsLoadFactor (List<double> flow, int numFlow) {
            var q = new List<double> ();
            var qq = new List<double> ();
            q.Add (0);
            for (var i = 0.1; i <= 1; i += 0.1) {
                qq = Q (flow, numFlow, i);
                for (var j = 0; j < qq.Count; j++)
                    qq[j] *= qq[j];
                q.Add (MathematicalExpectation (qq) - Math.Pow (MathematicalExpectation (Q (flow, numFlow, i)), 2));
            }
            return q;
        }

        private List<double> E (List<double> flow, int numFlow, double loadFactor) {
            var A = PacketsPerDt (flow, numFlow, loadFactor);
            var q = Q (flow, numFlow, loadFactor);
            var E = new List<double> { 0 };
            var mA = MathematicalExpectation (A);
            E.Add ((A[0] - mA) * q[0]);
            for (var i = 1; i < A.Count; i++)
                E.Add ((A[i] - mA) * (q[i] + q[i - 1]));
            return E;
        }

        private List<double> mE (List<double> flow, int numFlow) {
            var q = new List<double> { 0 };
            for (var i = 0.1; i <= 1; i += 0.1)
                q.Add (MathematicalExpectation (E (flow, numFlow, i)));
            return q;
        }

        private List<double> F (List<double> flow, int numFlow) {
            var q = new List<double> {
                MathematicalExpectation (E (flow, numFlow, 0.1)) * 2 / 0.1 -
                MathematicalExpectation (E (flow, numFlow, 0.2)) / 0.2
            };
            for (var i = 0.1; i <= 1; i += 0.1)
                q.Add (MathematicalExpectation (E (flow, numFlow, i)) / i);
            return q;
        }

        private List<double> Straight (double alpha, double beta) {
            var q = new List<double> ();
            for (double i = 0; i <= 1; i += 0.1)
                q.Add (alpha * i + beta);
            return q;
        }

        private List<double> Parabola (double alpha, double beta) {
            var q = new List<double> ();
            for (double i = 0; i <= 1; i += 0.1)
                q.Add (alpha * i * i + beta * i);
            return q;
        }

        private List<double> Aprox (double alpha, double beta) {
            var q = new List<double> ();
            for (double i = 0; i < 0.9; i += 0.1)
                q.Add ((alpha * i * i + beta * i) / 2 / (1 - i));
            q.Add (q.Last () + q.Last () - q[q.Count - 2]);
            return q;
        }

        private List<double> PKI (List<double> flow, int numFlow, double loadFactor) {
            var ki = KI (flow, numFlow, loadFactor);
            var bki = new List<double> ();
            for (var i = 0; i <= numFlow; i++)
                bki.Add (0);
            for (var i = 0; i <= numFlow; i++)
                for (var j = 0; j < ki.Count; j++)
                    if (ki[j] == i)
                        bki[i]++;

            for (var i = 0; i <= numFlow; i++)
                bki[i] /= ki.Count;
            return bki;
        }

        private double[] CoeffsAprox (List<double> flow) {
            var coeffs = new double[2];
            var step = flow.Max () / 100;
            var maxNumbOfHits = double.MaxValue;
            for (double b = 0; b < Math.Abs (flow[0]) + Math.Abs (flow[1]) + Math.Abs (flow[2]); b += step)
                for (var a = -2 * flow.Max (); a < 2 * flow.Max (); a += step) {
                    var temp = Straight (a, b);
                    double equality = 0;
                    for (var i = 2; i < 9; i += 1)
                        equality += Math.Abs ((temp[i] - flow[i]) * (temp[i] - flow[i]));
                    if (equality < maxNumbOfHits) {
                        maxNumbOfHits = equality;
                        coeffs[0] = a;
                        coeffs[1] = b;
                    }
                }

            return coeffs;
        }

        public List<Function> Get () {
            throw new NotImplementedException ();
        }
    }
}