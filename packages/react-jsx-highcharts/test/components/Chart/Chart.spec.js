import React from 'react';
import { Highcharts } from '../../test-utils';
import Chart from '../../../src/components/Chart/Chart';

describe('<Chart />', function ()  {
  let sandbox;

  beforeEach(function () {
    this.update = sinon.spy();
    this.getChart = sinon.stub();
    this.getChart.returns('mock-chart');

    sandbox = sinon.sandbox.create();
    sandbox.stub(Highcharts, 'addEvent');

    this.propsFromProviders = {
      update: this.update,
      getChart: this.getChart,
      getHighcharts: () => Highcharts
    };
  });

  afterEach(function () {
    sandbox.restore();
  });

  describe('when mounted', function () {
    it('updates the chart config with the provided props', function () {
      mount(<Chart type="bubble" {...this.propsFromProviders} />);
      expect(this.update).to.have.been.calledWith({
        chart : {
          type: 'bubble'
        }
      });
    });

    it('updates the chart with all props that don\'t look like event handlers', function () {
      mount(
        <Chart type="spline" propFoo="bar" zoomType="x" onClick={() => {}} {...this.propsFromProviders} />
      );
      expect(this.update).to.have.been.calledWith({
        chart : {
          type: 'spline',
          zoomType: 'x',
          propFoo: 'bar'
        }
      });
    });

    it('subscribes to Highcharts events for props that look like event handlers', function () {
      const handleClick = sinon.spy();
      const handleRender = sinon.spy();
      const handleBeforePrint = sinon.spy();

      mount(
        <Chart type="area" onClick={handleClick} onRender={handleRender} onBeforePrint={handleBeforePrint}
          {...this.propsFromProviders} />
      );
      expect(Highcharts.addEvent).to.have.been.calledWith('mock-chart', 'click', handleClick);
      expect(Highcharts.addEvent).to.have.been.calledWith('mock-chart', 'render', handleRender);
      expect(Highcharts.addEvent).to.have.been.calledWith('mock-chart', 'beforePrint', handleBeforePrint);
    });
  });

  describe('update', function () {
    it('should use the update method when props change', function () {
      const wrapper = mount(
        <Chart {...this.propsFromProviders} />
      );
      wrapper.setProps({ backgroundColor: 'red' });
      expect(this.update).to.have.been.calledWith({
        chart: {
          backgroundColor: 'red'
        }
      });
    });
  });
});
