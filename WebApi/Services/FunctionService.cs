using System;
using System.Collections.Generic;
using System.Linq;
using Services;
using WebApi.Entities;

namespace WebApi.Services {
    public interface IFunctionService {
        List<double> ProcessFunction (long functionId, List<double> flow, int numFlow, double loadFactor, double maxLoadFactor);
        IEnumerable<Function> GetFunctions ();
    }

    public class FlowFunctions : IFunctionService {
        private OtmoContext _context;

        public FlowFunctions () {
            _context = new OtmoContext ();
        }

        public List<double> ProcessFunction (long functionId, List<double> flow, int numFlow, double loadFactor, double maxLoadFactor) {
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
                    list = mA (flow, numFlow, maxLoadFactor);
                    break;
                case 4:
                    list = dA (flow, numFlow, maxLoadFactor);
                    break;
                case 5:
                    list = Q (flow, numFlow, loadFactor);
                    break;
                case 6:
                    list = mQDependsLoadFactor (flow, numFlow, maxLoadFactor);
                    break;
                case 7:
                    list = dQDependsLoadFactor (flow, numFlow, maxLoadFactor);
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
                    list = mE (flow, numFlow, maxLoadFactor);
                    break;
                case 13:
                    var mEList = mE (flow, numFlow, maxLoadFactor);
                    coeffs = CoeffsAprox2 (mEList, maxLoadFactor);
                    list = Aprox2 (coeffs[0], coeffs[1], coeffs[2], maxLoadFactor);
                    break;
                case 14:
                    var dAList = dA (flow, numFlow, maxLoadFactor);
                    list = Sqrt (dAList);
                    break;
                case 15:
                    var mAList = mA (flow, numFlow, maxLoadFactor);
                    var dAList2 = dA (flow, numFlow, maxLoadFactor);
                    list = Attitude (dAList2, mAList);
                    break;
                case 16:
                    var mQDependsLoadFactorList = mQDependsLoadFactor (flow, numFlow, maxLoadFactor);
                    coeffs = CoeffsAprox (mQDependsLoadFactorList, maxLoadFactor);
                    list = Aprox (coeffs[0], coeffs[1], coeffs[2], maxLoadFactor);
                    break;
                case 17:
                    list = KI (flow, numFlow, loadFactor);
                    break;
                case 18:
                    list = PKI (flow, numFlow, loadFactor);
                    break;
                case 19:
                    var sdvig = Convert.ToInt32 (TimeExperiment (flow) / 100);
                    list = Disp2 (flow, numFlow, loadFactor, sdvig);
                    break;
                case 20:
                    var sdvig2 = Convert.ToInt32 (TimeExperiment (flow) / 100);
                    list = Integral (flow, numFlow, loadFactor, sdvig2);
                    break;
                case 21:
                    list = mV (flow, numFlow, maxLoadFactor, 0);
                    break;
                case 22:
                    var mv2 = mV (flow, numFlow, maxLoadFactor, 0);
                    var mQDependsLoadFactorList2 = mQDependsLoadFactor (flow, numFlow, maxLoadFactor);

                    list = Attitude (mv2, mQDependsLoadFactorList2);
                    break;
                case 23:
                    var q = Sqrt (dA (flow, numFlow, maxLoadFactor));
                    list = mQ (q, maxLoadFactor);
                    break;
                case 24:
                    var mQDependsLoadFactorList3 = mQDependsLoadFactor (flow, numFlow, maxLoadFactor);
                    coeffs = CoeffsAprox3 (mQDependsLoadFactorList3, maxLoadFactor);
                    list = Aprox3 (coeffs[0], coeffs[1], coeffs[2], maxLoadFactor);
                    break;
            }
            return list;
        }

        private double TimeExperiment (List<double> flow) //длительность потока в сек
        {
            return flow.Last () - flow.First ();
        }

        private List<double> PacketsInterval (List<double> flow) // y - время между пакетами, x - номер пакета
        {
            var f = new List<double> { flow[0] };
            for (var i = 0; i < flow.Count () - 1; i++) {
                f.Add (flow[i + 1] - flow[i]);
            }
            return f;
        }

        private double FlowRate (List<double> flow, int numFlow)
        // лямбда кол-во пакетов/(время * количество приборов)
        {
            return flow.Count () / (TimeExperiment (flow) * numFlow);
        }

        private double mPReal (List<double> flow, List<double> bytes, int numFlow) // Количество/Сумму * Сумма/ количество
        {
            return FlowRate (flow, numFlow) * MathematicalExpectation (bytes);
        }

        private double DispersionReal (List<double> flow, List<double> bytes, int numFlow) {
            var m = MathematicalExpectation (bytes);
            var disp = bytes.Sum (t => (t - m) * (t - m));
            disp /= bytes.Count;
            return disp * FlowRate (flow, numFlow);
        }

        private List<double> mPRealFunction (double mpReal, double maxValue, double mlf) // Количество/Сумму * Сумма/ количество
        {
            var qq = new List<double> { 0 };
            var step = mlf / 20;

            for (var i = step; Math.Round (i, 5) <= mlf; i += step) {
                qq.Add (Math.Abs (i - mpReal) < step / 2 ? maxValue : 0);
            }
            return qq;
        }

        private double DeltaTime (List<double> flow, int numFlow, double loadFactor)
        // dt коэфф загрузки * время * кол-во приборов/ кол-во пакетов
        {
            return loadFactor / FlowRate (flow, numFlow); // сколько секунд в среднем между пакетами * P
        }

        private List<double> PacketsPerDt (List<double> flow, int numFlow, double loadFactor) // T*l/p
        {
            var dt = DeltaTime (flow, numFlow, loadFactor);
            double time = Convert.ToInt32 (TimeExperiment (flow) / dt - 1);

            var a = new List<double> ();
            for (var i = 0; i < time; i++) {
                a.Add (0);
            }
            var j = 0;
            for (var i = 1; i < a.Count (); i++) {
                while (flow[j] <= dt * i) {
                    a[i - 1] += 1;
                    j++;
                }
            }
            return a;
        }

        private List<double> Q (List<double> flow, int numFlow, double loadFactor) {
            var packetsPerDt = PacketsPerDt (flow, numFlow, loadFactor);
            var a = new List<double> ();

            if (packetsPerDt[0] - numFlow <= 0) {
                a.Add (0);
            } else {
                a.Add (packetsPerDt[0] - numFlow);
            }
            for (var i = 1; i < packetsPerDt.Count (); i++) {
                if (a[i - 1] + packetsPerDt[i] - numFlow <= 0) {
                    a.Add (0);
                } else {
                    a.Add (a[i - 1] + packetsPerDt[i] - numFlow);
                }
            }
            return a;
        }

        private List<double> mV (List<double> flow, int numFlow, double mlf, double maxQ) {
            var qq = new List<double> { 0 };
            var step = mlf / 20;
            for (var i = step; Math.Round (i, 5) <= mlf; i += step) {
                var newQ = maxQ != 0 ? Q (flow, numFlow, i).Select (f => f > maxQ ? f - maxQ : 0).ToList () : Q (flow, numFlow, i);
                qq.Add (MathematicalExpectation (newQ));
            }
            return qq;
        }

        private List<double> V (List<double> flow, int numFlow, double loadFactor) {
            var packetsPerDt = PacketsPerDt (flow, numFlow, loadFactor);
            var q = Q (flow, numFlow, loadFactor);
            var a = new List<double> { q[1] };
            for (var i = 1; i < q.Count; i++) {
                a.Add ((q[i] - q[i - 1]) / (double) loadFactor / 10F);
            }
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
            var disp = flow.Sum (t => (t - m) * (t - m));
            disp /= flow.Count;
            return disp;
        }

        private List<double> Disp2 (List<double> flow, int numFlow, double loadFactor, double sdvig) {
            sdvig *= FlowRate (flow, numFlow) / (double) loadFactor;
            var a = PacketsPerDt (flow, numFlow, loadFactor);
            var m = MathematicalExpectation (a);
            var disp = new List<double> ();
            double disp0 = 1;
            for (var i = 0; i < sdvig; i++) {
                disp.Add (0);
            }
            for (var i = 0; i < sdvig; i++) {
                for (var j = 0; j < sdvig - i; j++) {
                    disp[i] += (a[j] - m) * (a[j + i] - m);
                }
                if (i == 0)
                    disp0 = disp[i];
            }
            for (var i = 0; i < disp.Count; i++) {
                disp[i] /= disp0;
            }
            return disp;
        }

        private List<double> Integral (List<double> flow, int numFlow, double loadFactor, double sdvig) {
            var disp = Disp2 (flow, numFlow, loadFactor, sdvig);
            var integral = new List<double> ();
            double summ = 0;
            for (var i = 0; i < disp.Count (); i++) {
                summ += disp[i];
                integral.Add (summ);
            }
            return integral;
        }

        private List<double> Integral (List<double> flow) {
            var integral = new List<double> ();
            double summ = 0;
            for (var i = 0; i < flow.Count (); i++) {
                summ += flow[i];
                integral.Add (summ);
            }
            return integral;
        }

        private List<double> KI (List<double> flow, int numFlow, double loadFactor) {
            var a = new List<double> ();
            var q = Q (flow, numFlow, loadFactor);
            var packetsPerDt = PacketsPerDt (flow, numFlow, loadFactor);
            a.Add (0);
            for (var i = 1; i < packetsPerDt.Count; i++) {
                if (q[i - 1] + packetsPerDt[i] < numFlow)
                    a.Add (q[i - 1] + packetsPerDt[i]);
                else
                    a.Add (numFlow);
            }
            return a;
        }

        private List<double> B (List<double> flow, int numFlow, double loadFactor) {
            var packetsPerDt = PacketsPerDt (flow, numFlow, loadFactor);
            var max = packetsPerDt.Max () + 1;
            var b = new List<double> ();
            for (var i = 0; i < max; i++) {
                b.Add (0);
                for (var j = 0; j < packetsPerDt.Count; j++) {
                    if (packetsPerDt[j] == i)
                        b[i]++;
                }
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

        private List<double> mQDependsLoadFactor (List<double> flow, int numFlow, double mlf) {
            var qq = new List<double> { 0 };
            var step = mlf / 20;

            for (var i = step; Math.Round (i, 5) <= mlf; i += step) {
                qq.Add (MathematicalExpectation (Q (flow, numFlow, i)));
            }
            return qq;
        }

        private List<double> dA (List<double> flow, int numFlow, double mlf) {
            var q = new List<double> ();
            var qq = new List<double> ();
            q.Add (0);
            var step = mlf / 20;
            for (var i = step; Math.Round (i, 5) <= mlf; i += step) {
                qq = PacketsPerDt (flow, numFlow, i);
                for (var j = 0; j < qq.Count; j++) {
                    qq[j] *= qq[j];
                }
                q.Add (
                    (double)
                    (MathematicalExpectation (qq) -
                        Math.Pow (MathematicalExpectation (PacketsPerDt (flow, numFlow, i)), 2)));
            }
            return q;
        }

        private List<double> mA (List<double> flow, int numFlow, double mlf) {
            var q = new List<double> { 0 };
            var step = mlf / 20;

            for (var i = step; Math.Round (i, 5) <= mlf; i += step) {
                q.Add (MathematicalExpectation (PacketsPerDt (flow, numFlow, i)));
            }
            return q;
        }

        private List<double> dQDependsLoadFactor (List<double> flow, int numFlow, double mlf) {
            var q = new List<double> ();
            var qq = new List<double> ();
            q.Add (0);
            var step = mlf / 20;

            for (var i = step; Math.Round (i, 5) <= mlf; i += step) {
                qq = Q (flow, numFlow, i);
                for (var j = 0; j < qq.Count; j++) {
                    qq[j] *= qq[j];
                }
                q.Add ((double) (MathematicalExpectation (qq) - Math.Pow (MathematicalExpectation (Q (flow, numFlow, i)), 2)));
            }
            return q;
        }

        private List<double> E (List<double> flow, int numFlow, double loadFactor) {
            var A = PacketsPerDt (flow, numFlow, loadFactor);
            var q = Q (flow, numFlow, loadFactor);
            var E = new List<double> { 0 };
            var mA = MathematicalExpectation (A);
            E.Add ((A[0] - mA) * q[0]);
            for (var i = 1; i < A.Count; i++) {
                E.Add ((A[i] - mA) * (q[i] + q[i - 1]));
            }
            return E;
        }

        private List<double> mE (List<double> flow, int numFlow, double mlf) {
            var q = new List<double> { 0 };
            var step = mlf / 20;

            for (var i = step; Math.Round (i, 5) <= mlf; i += step) {
                q.Add (MathematicalExpectation (E (flow, numFlow, i)));
            }
            return q;
        }

        private List<double> F (List<double> flow, int numFlow, double mlf) {
            var step = mlf / 20;
            var q = new List<double> {
                2F * MathematicalExpectation (E (flow, numFlow, step)) / (double) step -
                MathematicalExpectation (E (flow, numFlow, 2 * step)) / (double) (2F * step)
            };
            if (q[0] < 0)
                q[0] = 0;
            for (var i = step; Math.Round (i, 5) <= mlf; i += step) {
                q.Add (MathematicalExpectation (E (flow, numFlow, i)) / (double) i);
            }
            return q;
        }

        private List<double> mQ (List<double> q, double mlf) {
            var step = mlf / 20;
            var list = new List<double> { 0 };
            for (var i = 1; i <= 20; i++) {
                list.Add ((double) (q[i] / (step * (double) i)));
            }
            list[0] = list[1] * 2 - list[2] >= 0 ? list[1] * 2 - list[2] : 0;

            return list;
        }

        private List<double> Straight (double alpha, double beta, double c, double mlf) {
            var step = (double) mlf / 20;
            var q = new List<double> ();
            if (c > 0) {
                for (double i = 0; i <= c; i += step) {
                    q.Add (0);
                }
            } else {
                c = -step;
            }
            for (var i = c + step; Math.Round (i, 5) <= mlf; i += step) {
                if (alpha * i + beta > 0)
                    q.Add (alpha * i + beta);
                else q.Add (0);
            }
            return q;
        }

        private List<double> Parabola (double alpha, double beta, double c, double mlf) {
            var step = (double) mlf / 20;
            var q = new List<double> ();
            if (c > 0) {
                for (double i = 0; i <= c; i += step) {
                    q.Add (0);
                }
            } else {
                c = -step;
            }

            for (var i = c + step; Math.Round (i, 5) <= mlf; i += step) {
                q.Add (alpha * i * i + beta * i);
            }
            return q;
        }

        private List<double> Aprox2 (double alpha, double beta, double c, double mlf) {
            var step = (double) mlf / 20;
            var q = new List<double> ();
            if (c > 0) {
                for (double i = 0; i <= c; i += step) {
                    q.Add (0);
                }
            }
            for (var i = c; i < mlf; i += step) {
                q.Add ((double) (alpha * (i - c) * (i - c) + beta * (i - c)));
            }
            return q;
        }

        private List<double> Aprox3 (double a, double b, double p0, double mlf) {
            var step = (double) mlf / 20;
            var q = new List<double> ();

            for (double i = 0; i < p0; i += step) {
                q.Add (0);
            }
            for (var i = p0; Math.Round (i, 5) <= mlf; i += step) {
                q.Add (a * (i - p0) + b * (i - p0) * (i - p0));
            }
            return q;
        }

        private List<double> PKI (List<double> flow, int numFlow, double loadFactor) {
            var ki = KI (flow, numFlow, loadFactor);
            var bki = new List<double> ();
            for (var i = 0; i <= numFlow; i++) {
                bki.Add (0);
            }
            for (var i = 0; i <= numFlow; i++) {
                for (var j = 0; j < ki.Count (); j++) {
                    if (ki[j] == i)
                        bki[i]++;
                }
            }
            for (var i = 0; i <= numFlow; i++) {
                bki[i] /= ki.Count ();
            }
            return bki;
        }

        private List<double> Aprox (double alpha, double beta, double c, double mlf) {
            var step = (double) mlf / 20;
            var q = new List<double> ();

            for (double i = 0; i < c; i += step) {
                q.Add (0);
            }
            for (var i = c; Math.Round (i, 5) <= mlf; i += step) {
                q.Add ((double) Math.Pow ((-alpha + Math.Sqrt (alpha * alpha - 4F * beta * (i - c))) / (2F * beta), 2));
                //q.Add((double) Math.Pow((-beta + Math.Sqrt(beta * beta - 4F* alpha * (i - c)))/(2F* alpha), 2));
            }
            return q;
        }

        private double[] CoeffsAprox2 (List<double> flow, double mlf) {
            double[] coeffs = new double[3];
            double step = flow.Max () / 100 / (double) mlf;
            double maxNumbOfHits = double.MaxValue;
            List<double> temp = new List<double> ();
            for (var i = 0; i < flow.Count; i++) {
                if (flow[i] <= flow.Max () / 50)
                    coeffs[2] = (double) (i * mlf / 20);
                else break;
            }
            for (double b = 0; b < Math.Abs (flow.Max ()) * 2 / mlf; b += step) {
                for (double a = 0; a < 100 * flow.Max () / mlf; a += step) {
                    temp = Aprox2 (a, b, coeffs[2], mlf);
                    double equality = 0;
                    for (int i = 4; i < 18; i += 2) {
                        equality += Math.Abs ((temp[i] - flow[i]) * (temp[i] - flow[i]));
                    }
                    if (equality < maxNumbOfHits) {
                        maxNumbOfHits = equality;
                        coeffs[0] = a;
                        coeffs[1] = b;
                    }
                }
            }

            return coeffs;
        }

        private double[] CoeffsAprox3 (List<double> flow, double mlf) {
            double[] coeffs = new double[3];
            double step = flow.Max () / 100 / (double) mlf;
            double maxNumbOfHits = double.MaxValue;
            List<double> temp = new List<double> ();
            for (var i = 0; i < flow.Count; i++) {
                if (flow[i] <= flow.Max () / 50)
                    coeffs[2] = (double) (i * mlf / 20);
                else break;
            }
            for (double b = 0; b < Math.Abs (flow.Max ()) * 2 / mlf; b += step) {
                for (double a = 0; a < 100 * flow.Max () / mlf; a += step) {
                    temp = Aprox3 (a, b, coeffs[2], mlf);
                    double equality = 0;
                    for (int i = 4; i < 18; i += 2) {
                        equality += Math.Abs ((temp[i] - flow[i]) * (temp[i] - flow[i]));
                    }
                    if (equality < maxNumbOfHits) {
                        maxNumbOfHits = equality;
                        coeffs[0] = a;
                        coeffs[1] = b;
                    }
                }
            }

            return coeffs;
        }

        private List<double> Sqrt (List<double> flow) {
            return flow.Select (x => (double) Math.Sqrt (x)).ToList ();
        }

        private List<double> Attitude (List<double> numerator, List<double> denominator) {
            List<int> zeroDenominator = new List<int> ();
            for (var i = 0; i < numerator.Count; i++) {
                if (denominator[i] == 0) {
                    zeroDenominator.Add (i);
                } else {
                    numerator[i] /= denominator[i];
                }
            }
            for (int i = 0; i < zeroDenominator.Count; i++) {
                if (zeroDenominator[i] + 2 > numerator.Count) {
                    numerator[i] = numerator[i - 1] * 2 - numerator[i - 2] < 0 ? 0 : numerator[i] = numerator[i - 1] * 2 - numerator[i - 2];
                } else {
                    numerator[i] = numerator[i + 1] * 2 - numerator[i + 2] < 0 ? 0 : numerator[i] = numerator[i + 1] * 2 - numerator[i + 2];
                }
            }
            return numerator;
        }

        private double[] CoeffsAprox (List<double> flow, double mlf) {
            var coeffs = new double[3];
            var maxNumbOfHits = double.MaxValue;
            // int test = 0;
            var temp = new List<double> ();
            for (var i = 0; i < flow.Count; i++) {
                if (flow[i] <= flow.Max () / 50)
                    coeffs[2] = (double) (i * mlf / 20);
                else break;
            }

            var amax = ((double) mlf - coeffs[2]) / (double) Math.Sqrt (flow.Max ());
            var bmax = ((double) mlf - coeffs[2]) / flow.Max ();

            for (var b = 0.0001F * bmax; b < bmax; b += 0.001F * bmax) // todo: поиграться с пределами
            {
                for (var a = -amax; a < amax; a += 0.001F * amax) {
                    temp = Aprox (a, b, coeffs[2], mlf);
                    double equality = 0;
                    for (var i = 2; i <= 20; i += 2) {
                        equality += Math.Abs (temp[i] - flow[i]);
                    }
                    if (equality < maxNumbOfHits) {
                        //   test++;
                        maxNumbOfHits = equality;
                        coeffs[0] = a;
                        coeffs[1] = b;
                    }
                }
            }
            //   MessageBox.Show(test + " ");
            return coeffs;
        }

        public IEnumerable<Function> GetFunctions () {
            return _context.Functions.ToList ();
        }
    }
}