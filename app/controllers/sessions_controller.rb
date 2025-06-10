class SessionsController < ApplicationController
  before_action :set_session, only: [:show, :edit, :update, :destroy]

  def index
    @sessions = Session.all
  end

  def show
  end

  def new
    @session = Session.new
  end

  def create
    @session = Session.new(session_params)
    
    if @session.save
      @sessions = Session.all
      respond_to do |format|
        format.turbo_stream
        format.html { redirect_to sessions_path, notice: 'Session was successfully created.' }
      end
    else
      render :new, status: :unprocessable_entity
    end
  end

  def edit
  end

  def update
    if @session.update(session_params)
      @sessions = Session.all
      respond_to do |format|
        format.turbo_stream
        format.html { redirect_to sessions_path, notice: 'Session was successfully updated.' }
      end
    else
      render :edit, status: :unprocessable_entity
    end
  end

  def destroy
    @session.destroy
    @sessions = Session.all
    respond_to do |format|
      format.turbo_stream
      format.html { redirect_to sessions_url, notice: 'Session was successfully deleted.' }
    end
  end

  private

  def set_session
    @session = Session.find(params[:id])
  end

  def session_params
    params.require(:session).permit(:name, :focus_time, :break_time, :completed)
  end
end
